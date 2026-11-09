"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUploadsTag = ApiUploadsTag;
exports.ApiUploadBearer = ApiUploadBearer;
exports.ApiUploadImageDocs = ApiUploadImageDocs;
exports.ApiUploadFileDocs = ApiUploadFileDocs;
exports.ApiUploadVideoDocs = ApiUploadVideoDocs;
exports.ApiUploadBase64Docs = ApiUploadBase64Docs;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const upload_base64_dto_1 = require("../dto/upload-base64.dto");
const multipartSchema = (fileLabel) => ({
    schema: {
        type: "object",
        properties: {
            file: {
                type: "string",
                format: "binary",
                description: fileLabel,
            },
            category: {
                type: "string",
                description: "Dossier logique (optionnel).",
            },
        },
        required: ["file"],
    },
});
function ApiUploadsTag() {
    return (0, swagger_1.ApiTags)("Uploads");
}
function ApiUploadBearer() {
    return (0, swagger_1.ApiBearerAuth)();
}
function ApiUploadImageDocs() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: "Uploader une image",
        description: "Retourne les informations et URLs du fichier hébergé.",
    }), (0, swagger_1.ApiConsumes)("multipart/form-data"), (0, swagger_1.ApiBody)(multipartSchema("Image")), (0, swagger_1.ApiResponse)({ status: 201, description: "Fichier enregistré" }));
}
function ApiUploadFileDocs() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: "Uploader un fichier",
        description: "Document ou média ; le type est déduit du contenu (image, vidéo ou autre).",
    }), (0, swagger_1.ApiConsumes)("multipart/form-data"), (0, swagger_1.ApiBody)(multipartSchema("Fichier")), (0, swagger_1.ApiResponse)({ status: 201, description: "Fichier enregistré" }));
}
function ApiUploadVideoDocs() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: "Uploader une vidéo",
        description: "Retourne les informations et URLs de la vidéo hébergée.",
    }), (0, swagger_1.ApiConsumes)("multipart/form-data"), (0, swagger_1.ApiBody)(multipartSchema("Vidéo")), (0, swagger_1.ApiResponse)({ status: 201, description: "Fichier enregistré" }));
}
function ApiUploadBase64Docs() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: "Uploader un fichier (base64)",
        description: "Corps JSON avec un seul champ `content` en data URI (data:<mime>;base64,...). " +
            "Le type est déduit du MIME (image, vidéo ou document).",
    }), (0, swagger_1.ApiConsumes)("application/json"), (0, swagger_1.ApiBody)({ type: upload_base64_dto_1.UploadBase64Dto }), (0, swagger_1.ApiResponse)({ status: 201, description: "Fichier enregistré" }));
}
//# sourceMappingURL=api-upload.decorator.js.map