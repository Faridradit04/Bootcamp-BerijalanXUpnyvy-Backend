
import { Router } from 'express';
import Joi from "joi";
import { CLogin, CRegister,CDeleteadmin,Cupdateadmin,CGetAllAdmins } from '../controllers/auth.controller.ts';
import { MValidate } from '../middlewares/error.middleware.ts';
import { MAuthValidate } from '../middlewares/auth.middleware.ts';
import { MCache, MInvalidateCache, CachePresets } from '../middlewares/cache.middleware.ts';
const router = Router();

// Skema Validasi

export const LoginSchema = Joi.object({
    usernameOrEmail: Joi.string().required(),
    password: Joi.string().required(), 
});

export const RegisterSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().min(8).required(), 
});

export const UpdateSchema = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    name: Joi.string(),
    password: Joi.string().min(8),
});


router.post('/login', MValidate(LoginSchema), CLogin); 
router.post('/register', MValidate(RegisterSchema), MAuthValidate , MInvalidateCache(["api_cache:*","user_cache:*"]), CRegister); // Invalidate all relevant caches on new admin
router.put('/update/:id', MValidate(UpdateSchema), MAuthValidate , MInvalidateCache(["api_cache:*","user_cache:*"]), Cupdateadmin); // Invalidate on update
router.delete('/delete/:id', MAuthValidate , MInvalidateCache(["api_cache:*","user_cache:*"]), CDeleteadmin); 
router.get('/admins', MAuthValidate , MCache(CachePresets.user(300)), CGetAllAdmins); 
export default router;