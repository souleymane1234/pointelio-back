import { ValidationArguments, ValidationError } from "class-validator";
import type { Locale, MessageKey } from "../i18n";
export declare const DEFAULT_VALIDATION_MESSAGE = "Les donn\u00E9es fournies sont invalides";
export declare function validationMessage(key: MessageKey): (args: ValidationArguments) => string;
export declare function localizeValidationMessage(locale: Locale, message: string): string;
export declare function localizeValidationBody<T>(locale: Locale, body: T): T;
export declare const extractValidationMessages: (errors: ValidationError[]) => string[];
