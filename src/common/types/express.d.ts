declare global {
  namespace Express {
    interface Request {
      /** Défini par le middleware headers API après validation ; sinon dérivé de `language`. */
      locale?: import("../i18n").Locale;
    }
  }
}

export {};
