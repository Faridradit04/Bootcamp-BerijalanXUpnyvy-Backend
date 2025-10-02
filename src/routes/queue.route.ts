import { Router } from "express";
import Joi from "joi";
import { MAuthValidate } from "../middlewares/auth.middleware";
import { MValidate } from "../middlewares/error.middleware";
import { MCache, MInvalidateCache, CachePresets } from '../middlewares/cache.middleware.ts';
import { CCreateQueue, CGetWaitingQueues, CUpdateQueueStatus } from "../controllers/queue.controller.ts";

const router = Router();

// Cache pattern for queue data specific to a counter
const QUEUE_CACHE_PATTERN = "api_cache:queue:*";

// --- Schemas ---

const createQueueSchema = Joi.object({
  counterId: Joi.number().required(),
});

const getWaitingQueuesSchema = Joi.object({
    counterId: Joi.number().required(),
});

const updateQueueStatusSchema = Joi.object({
    status: Joi.string().valid("CALLED", "SERVED", "MISSED").required(),
});

// --- Routes ---

// Endpoint for a user/client to get a new queue ticket (may or may not need MAuthValidate based on requirements)
// Assuming MAuthValidate is required for internal admin usage
router.post(
    "/create",
    MValidate(createQueueSchema),
    MAuthValidate,
    MInvalidateCache([QUEUE_CACHE_PATTERN]),
    CCreateQueue
);

// Endpoint to get all waiting queues for a specific counter (cached read)
router.get(
    "/waiting/:counterId",
    MValidate(getWaitingQueuesSchema),
    MAuthValidate,
    MCache(CachePresets.short(10)), // Queue data is highly volatile, use a very short cache (10s)
    CGetWaitingQueues
);

// Endpoint to update a queue ticket's status (e.g., calling the next customer)
router.put(
    "/status/:queueId",
    MValidate(updateQueueStatusSchema),
    MAuthValidate,
    MInvalidateCache([QUEUE_CACHE_PATTERN]), // Invalidate waiting list cache
    CUpdateQueueStatus
);

export default router;