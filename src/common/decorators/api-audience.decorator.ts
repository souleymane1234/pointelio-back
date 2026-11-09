import { applyDecorators } from "@nestjs/common";
import { ApiExtension, ApiTags } from "@nestjs/swagger";
import { SWAGGER_TAG, type SwaggerAudience } from "../swagger/swagger-tags";

/** Marque l'opération (ou tout le contrôleur) pour le filtre Swagger mobile / employeur / plateforme. */
export function ApiAudience(...audiences: SwaggerAudience[]) {
  const unique = [...new Set(audiences)];
  return applyDecorators(
    ApiTags(...unique.map((audience) => SWAGGER_TAG[audience])),
    ApiExtension("x-audience", unique),
  );
}
