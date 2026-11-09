import { REDIS_KEY_PREFIX } from "../../../../common/constants/app.constants";

/** Préfixe Redis des JWT révoqués (logout). */
export const AUTH_REVOKED_TOKEN_KEY_PREFIX = `${REDIS_KEY_PREFIX}:auth:revoked`;
