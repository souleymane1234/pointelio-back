import type { OpenAPIObject } from "@nestjs/swagger";
export declare const SWAGGER_TAG: {
    readonly mobile: "Mobile — client";
    readonly employeur: "Employeur — back-office";
    readonly plateforme: "Plateforme — Pointellio";
};
export type SwaggerAudience = keyof typeof SWAGGER_TAG;
export declare const SWAGGER_AUDIENCE_NOTE: Record<SwaggerAudience, string>;
export declare const SWAGGER_PATH = "api/v1/docs";
export declare const SWAGGER_MOBILE_PATH = "api/v1/docs/mobile";
export declare const SWAGGER_DESCRIPTION: string;
export declare const SWAGGER_MOBILE_DESCRIPTION: string;
export declare function filterOpenApiByTag(document: OpenAPIObject, tag: string, options: {
    titleSuffix: string;
    description: string;
}): OpenAPIObject;
