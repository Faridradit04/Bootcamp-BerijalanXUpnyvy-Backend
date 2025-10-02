import { Request, Response, NextFunction } from "express";
import { SCreateQueue, SGetWaitingQueues, SUpdateQueueStatus } from "../services/queue.service.ts";

export const CCreateQueue = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { counterId } = req.body;
        const result = await SCreateQueue(parseInt(counterId));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
export const CGetWaitingQueues = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const counterIdParam = req.params.counterId;

        if (!counterIdParam) {
            throw new Error("Counter ID is required.");
        }

        const counterId = parseInt(counterIdParam, 10);
        
        if (isNaN(counterId)) {
            throw new Error("Invalid Counter ID format.");
        }

        const result = await SGetWaitingQueues(counterId);
        
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const CUpdateQueueStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const queueIdParam = req.params.queueId;
        const { status } = req.body;

        if (!queueIdParam) {
            res.status(400).json({ status: false, message: "Queue ID is required for status update." });
            return;
        }

        const queueId = parseInt(queueIdParam, 10);
        
        if (isNaN(queueId)) {
            res.status(400).json({ status: false, message: "Invalid Queue ID format." });
            return;
        }

        const result = await SUpdateQueueStatus(queueId, status);
        
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};