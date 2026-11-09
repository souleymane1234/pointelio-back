import type { Prisma } from "@prisma/client";
import { parseModules } from "../../entitlements/entitlements.util";

export const PACK_SELECT = {
  id: true,
  code: true,
  nom: true,
  prixMensuel: true,
  description: true,
  maxEmployes: true,
  maxSites: true,
  essaiJours: true,
  modules: true,
  ordre: true,
  actif: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { entreprises: true } },
} satisfies Prisma.PackSelect;

type PackRow = Prisma.PackGetPayload<{ select: typeof PACK_SELECT }>;

export function normalizePack(row: PackRow) {
  const { _count, ...pack } = row;
  return {
    ...pack,
    modules: parseModules(pack.modules),
    entreprisesCount: _count.entreprises,
  };
}
