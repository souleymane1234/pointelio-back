"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestStore = getRequestStore;
exports.runWithRequestStore = runWithRequestStore;
const node_async_hooks_1 = require("node:async_hooks");
const storage = new node_async_hooks_1.AsyncLocalStorage();
function getRequestStore() {
    return storage.getStore();
}
function runWithRequestStore(store, fn) {
    return storage.run(store, fn);
}
//# sourceMappingURL=request-store.js.map