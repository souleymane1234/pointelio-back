import { type SwaggerAudience } from "../swagger/swagger-tags";
type Schema = new (...args: unknown[]) => unknown;
export declare function ApiEndpoint(config: {
    summary: string;
    description?: string;
    status?: number;
    schema?: Schema;
    notFound?: string;
    invalid?: string;
    audience?: SwaggerAudience | SwaggerAudience[];
}): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export {};
