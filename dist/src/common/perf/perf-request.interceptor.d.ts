import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
export declare class PerfRequestInterceptor implements NestInterceptor {
    private readonly logger;
    private readonly logThresholdMs;
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
