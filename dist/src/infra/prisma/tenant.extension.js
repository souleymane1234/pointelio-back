"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantExtension = exports.TENANT_MODELS = void 0;
exports.scopeTenantArgs = scopeTenantArgs;
exports.createTenantClient = createTenantClient;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const request_store_1 = require("../../common/context/request-store");
exports.TENANT_MODELS = new Set([
    "Utilisateur",
    "Invitation",
    "Site",
    "Horaire",
    "Pointage",
    "Demande",
    "Facture",
    "AuditLog",
]);
const WHERE_OPERATIONS = new Set([
    "findUnique",
    "findUniqueOrThrow",
    "findFirst",
    "findFirstOrThrow",
    "findMany",
    "count",
    "aggregate",
    "groupBy",
    "update",
    "updateMany",
    "updateManyAndReturn",
    "delete",
    "deleteMany",
    "upsert",
]);
function assertSameTenant(data, entrepriseId) {
    const value = data?.entrepriseId;
    if (value !== undefined && value !== entrepriseId) {
        throw new common_1.ForbiddenException("Cross-tenant write blocked");
    }
}
function withTenantData(data, entrepriseId) {
    assertSameTenant(data, entrepriseId);
    const record = data;
    if ("entreprise" in record || record.entrepriseId !== undefined) {
        return record;
    }
    return { ...record, entrepriseId };
}
function scopeTenantArgs(operation, args, entrepriseId) {
    const scoped = { ...(args ?? {}) };
    if (WHERE_OPERATIONS.has(operation)) {
        scoped.where = {
            ...(scoped.where ?? {}),
            entrepriseId,
        };
    }
    switch (operation) {
        case "create":
            scoped.data = withTenantData(scoped.data, entrepriseId);
            break;
        case "createMany":
        case "createManyAndReturn":
            scoped.data = (Array.isArray(scoped.data) ? scoped.data : [scoped.data]).map((row) => withTenantData(row, entrepriseId));
            break;
        case "upsert":
            scoped.create = withTenantData(scoped.create, entrepriseId);
            assertSameTenant(scoped.update, entrepriseId);
            break;
        case "update":
        case "updateMany":
        case "updateManyAndReturn":
            assertSameTenant(scoped.data, entrepriseId);
            break;
    }
    return scoped;
}
exports.tenantExtension = client_1.Prisma.defineExtension({
    name: "tenant",
    query: {
        $allModels: {
            $allOperations({ model, operation, args, query }) {
                const entrepriseId = (0, request_store_1.getRequestStore)()?.entrepriseId;
                if (!entrepriseId || !exports.TENANT_MODELS.has(model)) {
                    return query(args);
                }
                return query(scopeTenantArgs(operation, args, entrepriseId));
            },
        },
    },
});
function createTenantClient(client) {
    return client.$extends(exports.tenantExtension);
}
//# sourceMappingURL=tenant.extension.js.map