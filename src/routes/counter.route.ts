import { Router } from "express";
import Joi from "joi";
import { CDelete, CCreate, CGet, CUpdate } from "../controllers/counter.controller";
import { MValidate } from "../middlewares/error.middleware";

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


router.post("/create", MValidate(createSchema), CCreate);
router.put("/update", MValidate(updateSchema), CUpdate);
router.delete("/delete", MValidate(deleteSchema), CDelete);
router.get("/get", MValidate(getSchema), CGet);

export default router;
