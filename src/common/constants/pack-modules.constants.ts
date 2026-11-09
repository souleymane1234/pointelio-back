/** Modules activables par pack (valeurs stockées dans `Pack.modules` / `Entreprise.modulesOverride`). */
export const PACK_MODULES = {
  QR: "QR",
  GPS: "GPS",
  CONGES: "CONGES",
  HORAIRES_MULTIPLES: "HORAIRES_MULTIPLES",
  MULTI_SITES: "MULTI_SITES",
  RAPPORTS_AVANCES: "RAPPORTS_AVANCES",
  ROLES_AVANCES: "ROLES_AVANCES",
  SURVEILLANT: "SURVEILLANT",
} as const;

export type PackModule = (typeof PACK_MODULES)[keyof typeof PACK_MODULES];

export const PACK_MODULE_VALUES: readonly PackModule[] =
  Object.values(PACK_MODULES);

export function isPackModule(value: unknown): value is PackModule {
  return (
    typeof value === "string" &&
    (PACK_MODULE_VALUES as readonly string[]).includes(value)
  );
}
