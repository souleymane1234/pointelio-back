import type { INestApplicationContext } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { ServerOptions } from "socket.io";
export declare class RedisIoAdapter extends IoAdapter {
    protected readonly logger: Logger;
    private adapterConstructor;
    private clients;
    constructor(app: INestApplicationContext);
    connectToRedis(redisUrl: string): Promise<void>;
    createIOServer(port: number, options?: ServerOptions): any;
    close(server: unknown): Promise<void>;
}
