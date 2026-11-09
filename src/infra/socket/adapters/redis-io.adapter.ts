import type { INestApplicationContext } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import type { ServerOptions } from "socket.io";

/**
 * Diffuse les événements Socket.IO entre instances via Redis pub/sub :
 * un `emit` vers une room atteint les sockets connectés à n'importe quelle instance.
 * Sans effet visible sur une instance unique.
 */
export class RedisIoAdapter extends IoAdapter {
  protected readonly logger = new Logger(RedisIoAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter> | null = null;
  private clients: Redis[] = [];

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(redisUrl: string): Promise<void> {
    const pubClient = new Redis(redisUrl, { lazyConnect: true });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.clients = [pubClient, subClient];
    this.adapterConstructor = createAdapter(pubClient, subClient);
    this.logger.log("Socket.IO Redis adapter connected");
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    return server;
  }

  async close(server: unknown): Promise<void> {
    await super.close(server as Parameters<IoAdapter["close"]>[0]);
    await Promise.allSettled(this.clients.map((client) => client.quit()));
  }
}
