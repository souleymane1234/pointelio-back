"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bumpAllCacheGenerations = bumpAllCacheGenerations;
exports.createCacheNamespace = createCacheNamespace;
const crypto_1 = require("crypto");
const app_constants_1 = require("../../common/constants/app.constants");
const generationBumpers = new Set();
function bumpAllCacheGenerations() {
    for (const bump of generationBumpers)
        bump();
}
function createCacheNamespace(name, options = {}) {
    const prefix = `${app_constants_1.REDIS_KEY_PREFIX}:${name}:v${options.version ?? 1}`;
    const timeBucketMs = options.timeBucketMs ?? 0;
    let generation = 0;
    const bumpGeneration = () => {
        generation += 1;
    };
    generationBumpers.add(bumpGeneration);
    return {
        prefix,
        getGeneration: () => generation,
        bumpGeneration,
        buildKey: (segment, query) => {
            const slot = timeBucketMs > 0 ? String(Math.floor(Date.now() / timeBucketMs)) : "0";
            const normalized = JSON.stringify(Object.keys(query)
                .sort()
                .filter((k) => query[k] !== undefined)
                .reduce((acc, k) => {
                acc[k] = query[k];
                return acc;
            }, {}));
            const hash = (0, crypto_1.createHash)("sha256")
                .update(normalized)
                .digest("hex")
                .slice(0, 20);
            return `${prefix}:${segment}:g${generation}:${slot}:${hash}`;
        },
    };
}
//# sourceMappingURL=cache-namespace.js.map