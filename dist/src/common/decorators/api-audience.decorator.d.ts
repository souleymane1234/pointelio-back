import { type SwaggerAudience } from "../swagger/swagger-tags";
export declare function ApiAudience(...audiences: SwaggerAudience[]): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
