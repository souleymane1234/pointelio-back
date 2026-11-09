import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

/** Limite brute multer (la validation MIME/taille précise est dans UploadsService). */
const MULTIPART_FILE_SIZE_CAP = 100 * 1024 * 1024;

/**
 * Interceptor fichier unique + réponse 201 (création de ressource hébergée).
 */
export function UploadSingleFileCreated() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor("file", {
        limits: { fileSize: MULTIPART_FILE_SIZE_CAP },
      }),
    ),
    HttpCode(HttpStatus.CREATED),
  );
}
