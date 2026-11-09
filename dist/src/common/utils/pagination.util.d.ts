import type { PaginationMeta } from "../interfaces/response.interface";
export declare const DEFAULT_PER_PAGE = 10;
export declare function buildPaginationQuery(totalItems: number, page?: number, perPage?: number): {
    perPage: number;
    safePage: number;
    skip: number;
    pagination: PaginationMeta;
};
