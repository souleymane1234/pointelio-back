"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const common_1 = require("@nestjs/common");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const ioredis_1 = __importDefault(require("ioredis"));
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    logger = new common_1.Logger(RedisIoAdapter.name);
    adapterConstructor = null;
    clients = [];
    constructor(app) {
        super(app);
    }
    async connectToRedis(redisUrl) {
        const pubClient = new ioredis_1.default(redisUrl, { lazyConnect: true });
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        this.clients = [pubClient, subClient];
        this.adapterConstructor = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
        this.logger.log("Socket.IO Redis adapter connected");
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        if (this.adapterConstructor) {
            server.adapter(this.adapterConstructor);
        }
        return server;
    }
    async close(server) {
        await super.close(server);
        await Promise.allSettled(this.clients.map((client) => client.quit()));
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map