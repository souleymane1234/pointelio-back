"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultMessages = exports.AcceptedResponse = exports.noContentResponse = exports.upgradeRequiredResponse = exports.maintenanceResponse = exports.serverErrorResponse = exports.errorResponse = exports.forbiddenResponse = exports.validationErrorResponse = exports.paginatedSuggestionsResponse = exports.paginatedResponse = exports.successResponse = void 0;
const i18n_1 = require("../i18n");
const successResponse = (message, data, locale = "fr") => ({
    success: true,
    message: message ?? (0, i18n_1.translate)(locale, "genericSuccess"),
    ...(data !== undefined ? { data } : {}),
});
exports.successResponse = successResponse;
const paginatedResponse = (items, pagination, message, locale = "fr", count) => ({
    success: true,
    message: message ?? (0, i18n_1.translate)(locale, "paginationSuccess"),
    data: items,
    pagination,
    ...(count !== undefined ? { count } : {}),
});
exports.paginatedResponse = paginatedResponse;
const paginatedSuggestionsResponse = (items, meta, message, locale = "fr") => {
    const totalItems = items.length;
    const perPage = Math.max(totalItems, 1);
    return {
        success: true,
        message: message ?? (0, i18n_1.translate)(locale, "paginationSuccess"),
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
exports.paginatedSuggestionsResponse = paginatedSuggestionsResponse;
const validationErrorResponse = (errors, message, locale = "fr") => {
    const summary = (0, i18n_1.translate)(locale, "validationSummary");
    const resolvedMessage = message !== undefined && message !== ""
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
exports.validationErrorResponse = validationErrorResponse;
const forbiddenResponse = (message, locale = "fr") => ({
    success: false,
    message: message ?? (0, i18n_1.translate)(locale, "forbidden"),
});
exports.forbiddenResponse = forbiddenResponse;
const errorResponse = (message) => ({
    success: false,
    message,
});
exports.errorResponse = errorResponse;
const serverErrorResponse = (message, locale = "fr") => ({
    success: false,
    message: message ?? (0, i18n_1.translate)(locale, "serverError"),
});
exports.serverErrorResponse = serverErrorResponse;
const maintenanceResponse = (message, locale = "fr") => ({
    success: false,
    message: message ?? (0, i18n_1.translate)(locale, "maintenance"),
});
exports.maintenanceResponse = maintenanceResponse;
const upgradeRequiredResponse = (platform, min_version, current_version, can_bypass, message, locale = "fr") => ({
    success: false,
    message: message && message.trim().length > 0
        ? message
        : (0, i18n_1.translate)(locale, "upgradeDefault"),
    data: {
        platform,
        min_version,
        current_version,
        can_bypass,
    },
});
exports.upgradeRequiredResponse = upgradeRequiredResponse;
const noContentResponse = () => undefined;
exports.noContentResponse = noContentResponse;
exports.AcceptedResponse = exports.successResponse;
const getDefaultMessages = (locale = "fr") => ({
    success: (0, i18n_1.translate)(locale, "genericSuccess"),
    pagination: (0, i18n_1.translate)(locale, "paginationSuccess"),
    forbidden: (0, i18n_1.translate)(locale, "forbidden"),
    validation: (0, i18n_1.translate)(locale, "validationSummary"),
    serverError: (0, i18n_1.translate)(locale, "serverError"),
    maintenance: (0, i18n_1.translate)(locale, "maintenance"),
    upgradeDefault: (0, i18n_1.translate)(locale, "upgradeDefault"),
});
exports.getDefaultMessages = getDefaultMessages;
//# sourceMappingURL=response.util.js.map