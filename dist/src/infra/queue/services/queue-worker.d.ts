import { Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { type Job } from "bullmq";
import type IORedis from "ioredis";
export declare abstract class QueueWorker<T> implements OnModuleInit, OnModuleDestroy {
    private readonly connection;
    readonly queueName: string;
    protected readonly logger: Logger;
    protected readonly concurrency: number;
    private worker;
    protected constructor(connection: IORedis | null, queueName: string);
    protected abstract process(job: Job<T>): Promise<void>;
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
}
