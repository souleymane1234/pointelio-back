import { ForbiddenException } from "@nestjs/common";
import { Prisma, type PrismaClient } from "@prisma/client";
import { getRequestStore } from "../../common/context/request-store";

/** Modèles portant `entrepriseId` (Utilisateur et AuditLog : nullable). */
export const TENANT_MODELS: ReadonlySet<string> = new Set([
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

type Args = Record<string, unknown>;

function assertSameTenant(data: unknown, entrepriseId: number): void {
  const value = (data as Args | undefined)?.entrepriseId;
  if (value !== undefined && value !== entrepriseId) {
    throw new ForbiddenException("Cross-tenant write blocked");
  }
}

/** Ajoute `entrepriseId` si absent ; laisse une relation `entreprise` explicite intacte. */
function withTenantData(data: unknown, entrepriseId: number): unknown {
  assertSameTenant(data, entrepriseId);
  const record = data as Args;
  if ("entreprise" in record || record.entrepriseId !== undefined) {
    return record;
  }
  return { ...record, entrepriseId };
}

/**
 * Restreint les arguments d'une opération Prisma à l'entreprise courante.
 * Les écritures imbriquées (nested writes) ne sont pas couvertes : les services
 * doivent rester explicites, l'extension est un filet de sécurité.
 */
export function scopeTenantArgs(
  operation: string,
  args: Args | undefined,
  entrepriseId: number,
): Args {
  const scoped: Args = { ...(args ?? {}) };

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
      scoped.data = (
        Array.isArray(scoped.data) ? scoped.data : [scoped.data]
      ).map((row) => withTenantData(row, entrepriseId));
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

/**
 * Extension Prisma : injecte l'entreprise du contexte de requête (posée par
 * `TenantGuard`) dans chaque requête sur un modèle multi-tenant. Sans
 * entreprise dans le contexte (équipe Pointelio, jobs), aucune restriction.
 */
export const tenantExtension = Prisma.defineExtension({
  name: "tenant",
  query: {
    $allModels: {
      $allOperations({ model, operation, args, query }) {
        const entrepriseId = getRequestStore()?.entrepriseId;
        if (!entrepriseId || !TENANT_MODELS.has(model)) {
          return query(args);
        }
        return query(scopeTenantArgs(operation, args, entrepriseId));
      },
    },
  },
});

export function createTenantClient(client: PrismaClient) {
  return client.$extends(tenantExtension);
}

export type TenantPrismaClient = ReturnType<typeof createTenantClient>;
