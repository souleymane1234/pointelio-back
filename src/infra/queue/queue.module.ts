import {
  Global,
  Inject,
  Injectable,
  Logger,
  Module,
  OnApplicationShutdown,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import IORedis from "ioredis";
import { BULLMQ_CONNECTION } from "./jobs.constants";
import { JobLockService } from "./services/job-lock.service";

/** Ferme la connexion après l'arrêt des queues et workers (onModuleDestroy). */
@Injectable()
class BullMqConnectionLifecycle implements OnApplicationShutdown {
  private readonly logger = new Logger(BullMqConnectionLifecycle.name);

  constructor(
    @Inject(BULLMQ_CONNECTION) private readonly connection: IORedis | null,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    if (!this.connection) return;
    try {
      await this.connection.quit();
    } catch (error) {
      this.logger.warn(`BullMQ disconnect: ${(error as Error).message}`);
    }
  }
}

/**
 * Infra des traitements asynchrones : connexion BullMQ partagée et verrou de cron multi-instance.
 * Les queues métier étendent `QueueProducer` / `QueueWorker` dans leur propre module.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: BULLMQ_CONNECTION,
      inject: [ConfigService],
      useFactory: (config: ConfigService): IORedis | null => {
        const url = config.get<string>("REDIS_URL")?.trim();
        if (!url) return null;
        // BullMQ exige maxRetriesPerRequest: null pour les commandes bloquantes des workers.
        return new IORedis(url, { maxRetriesPerRequest: null });
      },
    },
    BullMqConnectionLifecycle,
    JobLockService,
  ],
  exports: [BULLMQ_CONNECTION, JobLockService],
})
export class QueueModule {}
