import { PrismaClient } from "@prisma/client";
import { IGlobalResponse } from "../interfaces/global.interface.js";
import { publishQueueUpdate } from "../configs/redis.config.ts";

const prisma = new PrismaClient();

// Utility to notify subscribers of queue changes via Redis Pub/Sub
const notifyQueueUpdate = async (counterId: number): Promise<void> => {
    await publishQueueUpdate({ counterId, timestamp: new Date().toISOString() });
};

/**
 * Creates a new queue ticket for a specific counter.
 */
export const SCreateQueue = async (counterId: number): Promise<IGlobalResponse> => {
    // 1. Check if the counter exists and is active
    const counter = await prisma.counter.findUnique({
        where: { id: counterId, isActive: true, deletedAt: null },
    });

    if (!counter) {
        throw new Error("Counter not found or is inactive");
    }

    // 2. Calculate the next queue number
    const currentMax = await prisma.queue.aggregate({
        where: { counterId },
        _max: { number: true },
    });

    const nextQueueNumber = (currentMax._max.number || 0) + 1;

    // 3. Create the queue ticket
    const newQueue = await prisma.queue.create({
        data: {
            counterId,
            number: nextQueueNumber,
            status: "WAITING",
        },
    });

    // 4. Update the counter's current queue number (optional, but good for quick display)
    await prisma.counter.update({
        where: { id: counterId },
        data: { currentQueue: nextQueueNumber },
    });

    // 5. Notify real-time clients
    await notifyQueueUpdate(counterId);

    return {
        status: true,
        message: "Queue ticket created successfully",
        data: {
            id: newQueue.id,
            counterId: newQueue.counterId,
            number: newQueue.number,
            status: newQueue.status,
        },
    };
};

/**
 * Gets the current list of waiting queues for a counter.
 */
export const SGetWaitingQueues = async (counterId: number): Promise<IGlobalResponse> => {
    const waitingQueues = await prisma.queue.findMany({
        where: {
            counterId,
            status: "WAITING",
        },
        orderBy: {
            number: "asc",
        },
        select: {
            id: true,
            number: true,
            status: true,
            createdAt: true,
        },
    });

    return {
        status: true,
        message: "Waiting queues retrieved successfully",
        data: waitingQueues,
    };
};

/**
 * Updates the status of a queue ticket (e.g., to 'CALLED', 'SERVED', or 'MISSED').
 */
export const SUpdateQueueStatus = async (
    queueId: number,
    status: "CALLED" | "SERVED" | "MISSED"
): Promise<IGlobalResponse> => {
    const existingQueue = await prisma.queue.findUnique({
        where: { id: queueId },
        include: { counter: true },
    });

    if (!existingQueue) {
        throw new Error("Queue ticket not found");
    }

    const updatedQueue = await prisma.queue.update({
        where: { id: queueId },
        data: { status },
    });

    // Notify real-time clients
    await notifyQueueUpdate(existingQueue.counterId);

    return {
        status: true,
        message: `Queue status updated to ${status}`,
        data: updatedQueue,
    };
};