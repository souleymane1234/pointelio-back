import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UploadBase64Dto } from "../dto/upload-base64.dto";

const multipartSchema = (fileLabel: string) => ({
  schema: {
    type: "object" as const,
    properties: {
      file: {
        type: "string" as const,
        format: "binary" as const,
        description: fileLabel,
      },
      category: {
        type: "string" as const,
        description: "Dossier logique (optionnel).",
      },
    },
    required: ["file"],
  },
});

export function ApiUploadsTag() {
  return ApiTags("Uploads");
}

/** Doit correspondre à `DocumentBuilder.addBearerAuth()` (schéma par défaut `bearer`). */
export function ApiUploadBearer() {
  return ApiBearerAuth();
}

export function ApiUploadImageDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "Uploader une image",
      description: "Retourne les informations et URLs du fichier hébergé.",
    }),
    ApiConsumes("multipart/form-data"),
    ApiBody(multipartSchema("Image")),
    ApiResponse({ status: 201, description: "Fichier enregistré" }),
  );
}

export function ApiUploadFileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "Uploader un fichier",
      description:
        "Document ou média ; le type est déduit du contenu (image, vidéo ou autre).",
    }),
    ApiConsumes("multipart/form-data"),
    ApiBody(multipartSchema("Fichier")),
    ApiResponse({ status: 201, description: "Fichier enregistré" }),
  );
}

export function ApiUploadVideoDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "Uploader une vidéo",
      description: "Retourne les informations et URLs de la vidéo hébergée.",
    }),
    ApiConsumes("multipart/form-data"),
    ApiBody(multipartSchema("Vidéo")),
    ApiResponse({ status: 201, description: "Fichier enregistré" }),
  );
}

export function ApiUploadBase64Docs() {
  return applyDecorators(
    ApiOperation({
      summary: "Uploader un fichier (base64)",
      description:
        "Corps JSON avec un seul champ `content` en data URI (data:<mime>;base64,...). " +
        "Le type est déduit du MIME (image, vidéo ou document).",
    }),
    ApiConsumes("application/json"),
    ApiBody({ type: UploadBase64Dto }),
    ApiResponse({ status: 201, description: "Fichier enregistré" }),
  );
}
