import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Contexte d'une requête HTTP, créé par `RequestContextMiddleware` puis complété
 * par les guards (entreprise). Mutable : les guards s'exécutent après le middleware.
 */
export interface RequestStore {
  requestId?: string;
  ip?: string;
  /** Entreprise de l'utilisateur connecté (null = équipe Pointelio ou route publique). */
  entrepriseId?: number | null;
}

const storage = new AsyncLocalStorage<RequestStore>();

/** Contexte courant ou undefined hors requête HTTP (jobs, seed, tests). */
export function getRequestStore(): RequestStore | undefined {
  return storage.getStore();
}

export function runWithRequestStore<T>(store: RequestStore, fn: () => T): T {
  return storage.run(store, fn);
}
