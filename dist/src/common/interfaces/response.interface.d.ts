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
    count?: number;
}
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
