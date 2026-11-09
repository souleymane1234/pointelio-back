import type { Locale } from "../i18n";
import { ErrorResponse, PaginationMeta, PaginatedResponse, SuccessResponse, SuggestionsPaginatedResponse } from "../interfaces/response.interface";
export declare const successResponse: <T>(message?: string, data?: T, locale?: Locale) => SuccessResponse<T>;
export declare const paginatedResponse: <T>(items: T[], pagination: PaginationMeta, message?: string, locale?: Locale, count?: number) => PaginatedResponse<T>;
export declare const paginatedSuggestionsResponse: <T>(items: T[], meta: {
    requestedDate: string;
    previewId?: string;
}, message?: string, locale?: Locale) => SuggestionsPaginatedResponse<T>;
export declare const validationErrorResponse: (errors: string[], message?: string, locale?: Locale) => ErrorResponse;
export declare const forbiddenResponse: (message?: string, locale?: Locale) => ErrorResponse;
export declare const errorResponse: (message: string) => ErrorResponse;
export declare const serverErrorResponse: (message?: string, locale?: Locale) => ErrorResponse;
export declare const maintenanceResponse: (message?: string, locale?: Locale) => ErrorResponse;
export interface UpgradeRequiredData {
    platform: string;
    min_version: string;
    current_version: string;
    can_bypass: boolean;
}
export interface UpgradeRequiredResponse extends ErrorResponse {
    data: UpgradeRequiredData;
}
export declare const upgradeRequiredResponse: (platform: string, min_version: string, current_version: string, can_bypass: boolean, message?: string, locale?: Locale) => UpgradeRequiredResponse;
export declare const noContentResponse: () => undefined;
export declare const AcceptedResponse: <T>(message?: string, data?: T, locale?: Locale) => SuccessResponse<T>;
export declare const getDefaultMessages: (locale?: Locale) => {
    success: string;
    pagination: string;
    forbidden: string;
    validation: string;
    serverError: string;
    maintenance: string;
    upgradeDefault: string;
};
