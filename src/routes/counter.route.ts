
import { Router } from "express";
import Joi from "joi";
import { CDelete, CCreate, CGet, CUpdate } from "../controllers/counter.controller";
import { MValidate } from "../middlewares/error.middleware";
import { MAuthValidate } from "../middlewares/auth.middleware";
import { MCache, MInvalidateCache, CachePresets } from '../middlewares/cache.middleware.ts'; // <--- Add this import

const router = Router();

const createSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().min(2).max(50).required(),
  currentQueue: Joi.number().default(0),
  maxQueue: Joi.number().min(1).required(),
  isActive: Joi.boolean().default(true),
});

const updateSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().min(2).max(50).optional(),
  currentQueue: Joi.number().optional(),
  maxQueue: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

const deleteSchema = Joi.object({
  id: Joi.number().required(),
});

const getSchema = Joi.object({
  id: Joi.number().required(),
});

const COUNTER_CACHE_PATTERN = "api_cache:counter:*"; // A specific pattern for counter-related caches

router.post("/create", MValidate(createSchema), MAuthValidate , MInvalidateCache([COUNTER_CACHE_PATTERN]) , CCreate);
router.put("/update", MValidate(updateSchema), MAuthValidate , MInvalidateCache([COUNTER_CACHE_PATTERN]) , CUpdate);
router.delete("/delete", MValidate(deleteSchema), MAuthValidate , MInvalidateCache([COUNTER_CACHE_PATTERN]) , CDelete);
router.get("/get", MValidate(getSchema), MAuthValidate , MCache(CachePresets.short(60)) , CGet); // Cache a single counter get for 60 seconds

export default router;
