import { Logger, OnModuleDestroy } from "@nestjs/common";
import { Queue, type JobsOptions } from "bullmq";
import type IORedis from "ioredis";
export declare abstract class QueueProducer<T> implements OnModuleDestroy {
    readonly queueName: string;
    private readonly jobOptions;
    protected readonly logger: Logger;
    protected readonly queue: Queue<T> | null;
    protected constructor(connection: IORedis | null, queueName: string, jobOptions?: JobsOptions);
    protected abstract runInline(data: T): Promise<void>;
    enqueue(jobName: string, data: T): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
