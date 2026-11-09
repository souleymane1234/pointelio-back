import { Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Worker, type Job } from "bullmq";
import type IORedis from "ioredis";

/**
 * Base d'un worker BullMQ. Démarre à l'init du module si Redis est configuré
 * et s'arrête proprement au shutdown (les jobs en cours se terminent).
 */
export abstract class QueueWorker<T> implements OnModuleInit, OnModuleDestroy {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly concurrency: number = 1;
  private worker: Worker<T> | null = null;

  protected constructor(
    private readonly connection: IORedis | null,
    readonly queueName: string,
  ) {}

  protected abstract process(job: Job<T>): Promise<void>;

  onModuleInit(): void {
    if (!this.connection) {
      this.logger.warn(
        `REDIS_URL absent : worker ${this.queueName} désactivé (traitement inline).`,
      );
      return;
    }

    this.worker = new Worker<T>(this.queueName, (job) => this.process(job), {
      connection: this.connection,
      concurrency: this.concurrency,
    });

    this.worker.on("failed", (job: Job<T> | undefined, err: Error) => {
      this.logger.error(
        `[${this.queueName}] job failed id=${job?.id ?? "?"} attempt=${job?.attemptsMade ?? "?"}: ${err.message}`,
      );
    });

    this.logger.log(
      `Worker ${this.queueName} started (concurrency=${this.concurrency}).`,
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
  }
}
