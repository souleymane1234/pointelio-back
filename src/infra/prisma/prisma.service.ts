import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { createPool, type Pool } from "mariadb";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  instrumentDbPool,
  perfProfilingEnabled,
} from "../../common/perf/perf-metrics";
import { mariadbPoolConfigFromUrl } from "./mariadb-pool-config";
import {
  createTenantClient,
  type TenantPrismaClient,
} from "./tenant.extension";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  /** Pool mariadb sous-jacent — exposé pour l'échantillonnage perf (stats de saturation). */
  readonly pool: Pool;

  /**
   * Client restreint à l'entreprise de la requête courante (voir `tenant.extension`).
   * À utiliser dans les modules métier des entreprises clientes.
   */
  readonly tenant: TenantPrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const pool = createPool(mariadbPoolConfigFromUrl(connectionString));
    if (perfProfilingEnabled()) {
      instrumentDbPool(pool);
    }
    const adapter = new PrismaMariaDb(pool);

    super({
      adapter,
      log: ["error", "warn"],
    });

    this.pool = pool;
    this.tenant = createTenantClient(this);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("Database connection established");
    } catch (error) {
      this.logger.error("Failed to connect to database", error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log("Database connection closed");
  }
}
