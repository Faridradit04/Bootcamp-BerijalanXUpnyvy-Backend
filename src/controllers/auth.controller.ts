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
        const {usernameOrEmail,password} = req.body;
        const result = await SLogin(usernameOrEmail,password);
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
const Cupdateadmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { username, email, name, password } = req.body;
        if (!id) {
            res.status(400).json({ status: false, message: "ID is required for update" });
            return;
        }

        const result = await SUpdateAdmin(parseInt(id), username, email, name, password);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

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