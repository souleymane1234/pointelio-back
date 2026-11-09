import { Prisma, type PrismaClient } from "@prisma/client";
export declare const TENANT_MODELS: ReadonlySet<string>;
type Args = Record<string, unknown>;
export declare function scopeTenantArgs(operation: string, args: Args | undefined, entrepriseId: number): Args;
export declare const tenantExtension: (client: any) => {
    $extends: {
        extArgs: import("@prisma/client/runtime/client").InternalArgs<unknown, unknown, {}, unknown>;
    };
};
export declare function createTenantClient(client: PrismaClient): import("@prisma/client/runtime/client").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
    result: {};
    model: {};
    query: {};
    client: {};
}, {}>, Prisma.TypeMapCb<Prisma.PrismaClientOptions>, {
    result: {};
    model: {};
    query: {};
    client: {};
}>;
export type TenantPrismaClient = ReturnType<typeof createTenantClient>;
export {};
