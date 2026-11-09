import type { Locale } from "../i18n";
import { translate } from "../i18n";
import {
  ErrorResponse,
  PaginationMeta,
  PaginatedResponse,
  SuccessResponse,
  SuggestionsPaginatedResponse,
} from "../interfaces/response.interface";

/**
 * Conventions statuts API mobile (doc) — messages par défaut via `translate` + JSON `locales/`.
 */
export const successResponse = <T>(
  message?: string,
  data?: T,
  locale: Locale = "fr",
): SuccessResponse<T> => ({
  success: true,
  message: message ?? translate(locale, "genericSuccess"),
  ...(data !== undefined ? { data } : {}),
});

export const paginatedResponse = <T>(
  items: T[],
  pagination: PaginationMeta,
  message?: string,
  locale: Locale = "fr",
  count?: number,
): PaginatedResponse<T> => ({
  success: true,
  message: message ?? translate(locale, "paginationSuccess"),
  data: items,
  pagination,
  ...(count !== undefined ? { count } : {}),
});

export const paginatedSuggestionsResponse = <T>(
  items: T[],
  meta: { requestedDate: string; previewId?: string },
  message?: string,
  locale: Locale = "fr",
): SuggestionsPaginatedResponse<T> => {
  const totalItems = items.length;
  const perPage = Math.max(totalItems, 1);
  return {
    success: true,
    message: message ?? translate(locale, "paginationSuccess"),
    data: items,
    pagination: {
      current_page: 1,
      total_pages: 1,
      per_page: perPage,
      total_items: totalItems,
    },
    isSuggestions: true,
    requestedDate: meta.requestedDate,
    ...(meta.previewId ? { previewId: meta.previewId } : {}),
  };
};

export const validationErrorResponse = (
  errors: string[],
  message?: string,
  locale: Locale = "fr",
): ErrorResponse => {
  const summary = translate(locale, "validationSummary");
  const resolvedMessage =
    message !== undefined && message !== ""
      ? message
      : errors.length === 1
        ? errors[0]
        : summary;

  return {
    success: false,
    message: resolvedMessage ?? summary,
    errors,
  };
};

export const forbiddenResponse = (
  message?: string,
  locale: Locale = "fr",
): ErrorResponse => ({
  success: false,
  message: message ?? translate(locale, "forbidden"),
});

export const errorResponse = (message: string): ErrorResponse => ({
  success: false,
  message,
});

export const serverErrorResponse = (
  message?: string,
  locale: Locale = "fr",
): ErrorResponse => ({
  success: false,
  message: message ?? translate(locale, "serverError"),
});

export const maintenanceResponse = (
  message?: string,
  locale: Locale = "fr",
): ErrorResponse => ({
  success: false,
  message: message ?? translate(locale, "maintenance"),
});

export interface UpgradeRequiredData {
  platform: string;
  min_version: string;
  current_version: string;
  can_bypass: boolean;
}

export interface UpgradeRequiredResponse extends ErrorResponse {
  data: UpgradeRequiredData;
}

export const upgradeRequiredResponse = (
  platform: string,
  min_version: string,
  current_version: string,
  can_bypass: boolean,
  message?: string,
  locale: Locale = "fr",
): UpgradeRequiredResponse => ({
  success: false,
  message:
    message && message.trim().length > 0
      ? message
      : translate(locale, "upgradeDefault"),
  data: {
    platform,
    min_version,
    current_version,
    can_bypass,
  },
});

/** DELETE réussi sans body (associer @HttpCode(HttpStatus.NO_CONTENT) sur la route). */
export const noContentResponse = () => undefined;

export const AcceptedResponse = successResponse;

export const getDefaultMessages = (locale: Locale = "fr") => ({
  success: translate(locale, "genericSuccess"),
  pagination: translate(locale, "paginationSuccess"),
  forbidden: translate(locale, "forbidden"),
  validation: translate(locale, "validationSummary"),
  serverError: translate(locale, "serverError"),
  maintenance: translate(locale, "maintenance"),
  upgradeDefault: translate(locale, "upgradeDefault"),
});
