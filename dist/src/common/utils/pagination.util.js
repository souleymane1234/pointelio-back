"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PER_PAGE = void 0;
exports.buildPaginationQuery = buildPaginationQuery;
exports.DEFAULT_PER_PAGE = 10;
function buildPaginationQuery(totalItems, page, perPage) {
    const perPageResolved = perPage ?? exports.DEFAULT_PER_PAGE;
    const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / perPageResolved);
    const safePage = Math.min(Math.max(1, page ?? 1), totalPages);
    const skip = (safePage - 1) * perPageResolved;
    return {
        perPage: perPageResolved,
        safePage,
        skip,
        pagination: {
            current_page: safePage,
            total_pages: totalPages,
            per_page: perPageResolved,
            total_items: totalItems,
        },
    };
}
//# sourceMappingURL=pagination.util.js.map