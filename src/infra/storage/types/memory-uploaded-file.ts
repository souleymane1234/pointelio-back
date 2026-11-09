/**
 * Fichier tel que le renvoie multer avec FileInterceptor (stockage mémoire).
 */
export interface MemoryUploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
