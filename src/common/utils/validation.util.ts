import { ValidationArguments, ValidationError } from "class-validator";
import type { Locale, MessageKey } from "../i18n";
import { translate } from "../i18n";
import fr from "../i18n/locales/fr.json";

export const DEFAULT_VALIDATION_MESSAGE = "Les données fournies sont invalides";

/** Message class-validator : clé i18n, avec la limite numérique en suffixe (`clé:10`). */
export function validationMessage(key: MessageKey) {
  return (args: ValidationArguments): string => {
    const constraint = args.constraints?.[0];
    return typeof constraint === "number" ? `${key}:${constraint}` : key;
  };
}

/** Traduit une clé i18n laissée par class-validator. Une phrase déjà traduite est renvoyée telle quelle. */
export function localizeValidationMessage(
  locale: Locale,
  message: string,
): string {
  const match = /^([A-Za-z0-9]+):(-?\d+(?:\.\d+)?)$/.exec(message);
  const key = match?.[1] ?? message;
  if (!(key in fr)) return message;
  const params = match ? { max: Number(match[2]) } : undefined;
  return translate(locale, key as MessageKey, params);
}

export function localizeValidationBody<T>(locale: Locale, body: T): T {
  if (!body || typeof body !== "object") return body;
  const record = body as Record<string, unknown>;
  if (!Array.isArray(record.errors)) return body;

  const errors = record.errors.map((item) =>
    localizeValidationMessage(locale, String(item)),
  );
  const rawMessage =
    typeof record.message === "string"
      ? localizeValidationMessage(locale, record.message)
      : record.message;
  const frenchSummary = translate("fr", "validationSummary");
  const message =
    rawMessage === frenchSummary
      ? translate(locale, "validationSummary")
      : rawMessage;

  return { ...record, errors, message } as T;
}

const buildConstraintMessage = (
  error: ValidationError,
  parentPath?: string,
): string[] => {
  const fieldPath = parentPath
    ? `${parentPath}.${error.property}`
    : error.property;
  const constraints = error.constraints ? Object.values(error.constraints) : [];

  const messages = constraints.length
    ? constraints
    : error.children?.length
      ? error.children.flatMap((child) =>
          buildConstraintMessage(child, fieldPath),
        )
      : [`Le champ "${fieldPath}" est invalide`];

  return messages;
};

export const extractValidationMessages = (
  errors: ValidationError[],
): string[] => {
  const formatted = errors.flatMap((error) => buildConstraintMessage(error));
  return formatted.length
    ? Array.from(new Set(formatted))
    : [DEFAULT_VALIDATION_MESSAGE];
};
