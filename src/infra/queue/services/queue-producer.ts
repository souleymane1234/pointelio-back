import { Logger, OnModuleDestroy } from "@nestjs/common";
import { Queue, type JobsOptions } from "bullmq";
import type IORedis from "ioredis";

const DEFAULT_JOB_OPTIONS: JobsOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 5_000 },
  removeOnComplete: 1_000,
  removeOnFail: 5_000,
};

/**
 * Base d'un producteur BullMQ. Sans Redis, `enqueue` exécute `runInline` dans la requête
 * pour que le traitement ne soit jamais perdu en local ou en test.
 */
export abstract class QueueProducer<T> implements OnModuleDestroy {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly queue: Queue<T> | null;

  protected constructor(
    connection: IORedis | null,
    readonly queueName: string,
    private readonly jobOptions: JobsOptions = DEFAULT_JOB_OPTIONS,
  ) {
    this.queue = connection ? new Queue<T>(queueName, { connection }) : null;
  }

  /** Traitement exécuté directement quand la queue est indisponible. */
  protected abstract runInline(data: T): Promise<void>;

  async enqueue(jobName: string, data: T): Promise<void> {
    if (!this.queue) {
      await this.runInline(data);
      return;
    }
    try {
      await (this.queue as Queue).add(jobName, data, this.jobOptions);
    } catch (error) {
      this.logger.error(
        `[${this.queueName}] enqueue failed, running inline: ${(error as Error).message}`,
      );
      await this.runInline(data);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue?.close();
  }
}
