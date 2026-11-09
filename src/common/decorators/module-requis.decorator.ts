import { SetMetadata } from "@nestjs/common";
import { MODULES_REQUIS_KEY } from "../constants/auth.constants";
import type { PackModule } from "../constants/pack-modules.constants";

/**
 * Exige un ou plusieurs modules du pack de l'entreprise (tous requis).
 * Exemple : `@ModuleRequis(PACK_MODULES.GPS)`
 */
export const ModuleRequis = (...modules: PackModule[]) =>
  SetMetadata(MODULES_REQUIS_KEY, modules);
