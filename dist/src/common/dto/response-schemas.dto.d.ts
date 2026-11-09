export declare class SuccessResponseSchemaDto {
    success: true;
    message: string;
}
export declare class ErrorResponseSchemaDto {
    success: false;
    message: string;
    errors?: string[];
}
