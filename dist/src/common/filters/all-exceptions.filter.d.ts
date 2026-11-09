import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    private readonly colors;
    private readonly sensitiveKeyMatchers;
    private isSensitiveKey;
    private redactValue;
    private logError;
    catch(exception: unknown, host: ArgumentsHost): Response<any, Record<string, any>>;
    private bodyParserErrorStatus;
    private isUniqueConstraintError;
}
