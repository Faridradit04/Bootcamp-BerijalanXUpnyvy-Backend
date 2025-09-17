import { Request, Response, NextFunction } from "express";
import { redisClient } from "../configs/redis.config.ts";
import { CacheOptions } from "../interfaces/cache.interface.ts";
import crypto from "crypto";

declare global {
  namespace Express {
    interface Request {
      admin?: { id?: string };
    }
  }
}

export const MCache = (options: CacheOptions = {}) => {
  const {
    ttl = 300,
    keyPrefix = "api_cache",
    skipCacheIf,
    invalidateOnMethods = ["POST", "PUT", "DELETE", "PATCH"],
  } = options;
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (invalidateOnMethods.includes(req.method)) {
        return next();
      }
      if (skipCacheIf && skipCacheIf(req)) {
        return next();
      }
      const cacheKey = generateCacheKey(req, keyPrefix);
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        res.setHeader("X-Cache-Status", "HIT");
        res.setHeader("X-Cache-Key", cacheKey);
        console.log("parsed", parsed);
        console.log("typeof parsed", typeof parsed);
        return res.status(parsed.statusCode).json(parsed.data);
      }
      const originalSend = res.send;
      res.send = function (data: any) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const cacheData = {
            statusCode: res.statusCode,
            data: JSON.parse(data),
            timestamp: new Date().toISOString(),
          };
          setImmediate(async () => {
            try {
              await redisClient.setEx(cacheKey, ttl, JSON.stringify(cacheData));
            } catch (error) {
              console.error("Error setting cache:", error);
            }
          });
        }
        res.setHeader("X-Cache-Status", "MISS");
        res.setHeader("X-Cache-Key", cacheKey);
        return originalSend.call(this, data);
      };
      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};




const invalidateCachePatterns = async (patterns: string[]) => {
    for (const pattern of patterns) {
        const iter = redisClient.scanIterator({
            MATCH: pattern,
        });
        for await (const key of iter) {
            await redisClient.del(key);
        }
    }
};

export const MInvalidateCache = (patterns :string[])=>{
    return async(req:Request,res:Response,next:NextFunction)=> {
        try{
            const originalJson=res.json;
            res.json=function(data:any){
                if(res.statusCode>=200 && res.statusCode<300){
                    setImmediate(async()=> {
                        try{
                            await invalidateCachePatterns(patterns);

                        }
                        catch(error){
                            console.error("Error invalidating cache:",error);
                        }
                    });
                }
                return originalJson.call(this,data);

            };
            next();
        }
        catch(error){
            console.error("Invalidate cache middleware error:",error);
            next();
        }
    }
}

const generateCacheKey = (req: Request, prefix: string): string => {
  const url = req.originalUrl || req.url;
  const method = req.method;
  const userAgent = req.get("user-agent") || "";
  const userId = req.admin?.id || "anonymous";

  const keyData = {
    method,
    url,
    userId,
    userAgent: crypto.createHash("md5").update(userAgent).digest("hex").substring(0, 8),
  };
  
  const keyString = JSON.stringify(keyData);
  const hash = crypto.createHash("md5").update(keyString).digest("hex");
  
  return `${prefix}:${hash}`;
};

export const CachePresets={
  short : (ttl:number = 60) : CacheOptions => ({
    ttl,
    keyPrefix: "short_cache",
  }),
  medium: (ttl:number=300) : CacheOptions=>({
    ttl,
    keyPrefix:"medium_cache"
  }),
  long: (ttl:number=3600): CacheOptions => ({
    ttl,
    keyPrefix:"long_cache"
  }),
  user: (ttl: number=600): CacheOptions=>({
    ttl,
    keyPrefix:"user_cache"
  })


}