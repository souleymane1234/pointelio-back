export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_items: number;
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> extends SuccessResponse<T[]> {
  data: T[];
  pagination: PaginationMeta;
  /** Compteur global (ex. notifications non lues pour badge). */
  count?: number;
}

/** Liste paginée de suggestions (ex. résultats alternatifs). */
export interface SuggestionsPaginatedResponse<T> extends PaginatedResponse<T> {
  isSuggestions: true;
  requestedDate: string;
  previewId?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}
