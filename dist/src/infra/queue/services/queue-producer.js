"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueProducer = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const DEFAULT_JOB_OPTIONS = {
    attempts: 3,
    backoff: { type: "exponential", delay: 5_000 },
    removeOnComplete: 1_000,
    removeOnFail: 5_000,
};
class QueueProducer {
    queueName;
    jobOptions;
    logger = new common_1.Logger(this.constructor.name);
    queue;
    constructor(connection, queueName, jobOptions = DEFAULT_JOB_OPTIONS) {
        this.queueName = queueName;
        this.jobOptions = jobOptions;
        this.queue = connection ? new bullmq_1.Queue(queueName, { connection }) : null;
    }
    async enqueue(jobName, data) {
        if (!this.queue) {
            await this.runInline(data);
            return;
        }
        try {
            await this.queue.add(jobName, data, this.jobOptions);
        }
        catch (error) {
            this.logger.error(`[${this.queueName}] enqueue failed, running inline: ${error.message}`);
            await this.runInline(data);
        }
    }
    async onModuleDestroy() {
        await this.queue?.close();
    }
}
exports.QueueProducer = QueueProducer;
//# sourceMappingURL=queue-producer.js.map