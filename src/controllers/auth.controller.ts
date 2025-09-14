import {Request,Response,NextFunction} from "express";
import {
    SLogin,SUpdateAdmin,SdeleteAdmin,SRegisterAdmin
} from "../services/auth.service.ts";

export const CLogin=async (
    req:Request,
    res:Response,
    next:NextFunction
): Promise<void>=>{
    try {
        const {username,password} = req.body;
        const result = await SLogin(username,password);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}


export const CRegister = async(
    req:Request,
    res:Response,
    next:NextFunction 
) : Promise <void> => {
try {
    const { username,email,name,password} = req.body;
    const result = await SRegisterAdmin(username,email,name,password)
    res.status(200).json(result)
}
catch(error){
    next(error);
}
}

const Cupdateadmin= async (
    req : Request,
    res: Response,
    next:NextFunction
) : Promise<void>=>{
    try {
        const {id,username,email,name,password} = req.body
        const result = await SUpdateAdmin(id,username,email,name,password)
        res.status(200).json(result)
    }
    catch (error){
        next(error)
    }
}

const CDeleteadmin= async ( 
    req:Request,
    res:Response,
    next:NextFunction 
):Promise<void> => {
    const {id} = req.body
    const result= await SdeleteAdmin(id);
    res.status(200).json(result)
}


export { CDeleteadmin,Cupdateadmin}