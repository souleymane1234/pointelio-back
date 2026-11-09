"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueWorker = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
class QueueWorker {
    connection;
    queueName;
    logger = new common_1.Logger(this.constructor.name);
    concurrency = 1;
    worker = null;
    constructor(connection, queueName) {
        this.connection = connection;
        this.queueName = queueName;
    }
    onModuleInit() {
        if (!this.connection) {
            this.logger.warn(`REDIS_URL absent : worker ${this.queueName} désactivé (traitement inline).`);
            return;
        }
        this.worker = new bullmq_1.Worker(this.queueName, (job) => this.process(job), {
            connection: this.connection,
            concurrency: this.concurrency,
        });
        this.worker.on("failed", (job, err) => {
            this.logger.error(`[${this.queueName}] job failed id=${job?.id ?? "?"} attempt=${job?.attemptsMade ?? "?"}: ${err.message}`);
        });
        this.logger.log(`Worker ${this.queueName} started (concurrency=${this.concurrency}).`);
    }
    async onModuleDestroy() {
        await this.worker?.close();
    }
}
exports.QueueWorker = QueueWorker;
//# sourceMappingURL=queue-worker.js.map