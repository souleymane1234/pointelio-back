import type { PaginationMeta } from "../interfaces/response.interface";

export const DEFAULT_PER_PAGE = 10;

/**
 * Calcule `skip` / `take` et la méta de pagination à partir du total.
 * La page demandée est bornée à [1, totalPages].
 */
export function buildPaginationQuery(
  totalItems: number,
  page?: number,
  perPage?: number,
): {
  perPage: number;
  safePage: number;
  skip: number;
  pagination: PaginationMeta;
} {
  const perPageResolved = perPage ?? DEFAULT_PER_PAGE;
  const totalPages =
    totalItems === 0 ? 1 : Math.ceil(totalItems / perPageResolved);
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
