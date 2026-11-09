/** Nom affiché dans Swagger, la bannière et les e-mails. */
export const APP_NAME = "Pointellio API";

/**
 * Préfixe des clés Redis écrites directement (verrous, révocations, cache).
 * À renommer pour isoler plusieurs projets partageant le même Redis.
 */
export const REDIS_KEY_PREFIX = "app";
