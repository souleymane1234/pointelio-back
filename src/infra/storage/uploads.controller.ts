import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
} from "@nestjs/common";
import { ApiAudience } from "../../common/decorators/api-audience.decorator";
import {
  ApiUploadBase64Docs,
  ApiUploadBearer,
  ApiUploadFileDocs,
  ApiUploadsTag,
} from "./decorators/api-upload.decorator";
import { UploadSingleFileCreated } from "./decorators/upload-single-file.decorator";
import { UploadBase64Dto } from "./dto/upload-base64.dto";
import { UploadCategoryDto } from "./dto/upload-category.dto";
import type { MemoryUploadedFile } from "./types/memory-uploaded-file";
import { UploadsService } from "./uploads.service";
import {
  type AuthedRequest,
  getUserId,
} from "../../common/types/request-context";

@ApiUploadsTag()
@ApiAudience("mobile", "employeur")
@ApiUploadBearer()
@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("content")
  @ApiUploadFileDocs()
  @UploadSingleFileCreated()
  uploadContent(
    @Req() req: AuthedRequest,
    @UploadedFile() file: MemoryUploadedFile,
    @Body() body: UploadCategoryDto,
  ) {
    const actorUserId = getUserId(req);
    return this.uploadsService.processFileUpload(file, body, actorUserId);
  }

  @Post("content/base64")
  @ApiUploadBase64Docs()
  @HttpCode(HttpStatus.CREATED)
  uploadContentBase64(
    @Req() req: AuthedRequest,
    @Body() body: UploadBase64Dto,
  ) {
    const actorUserId = getUserId(req);
    return this.uploadsService.processBase64Upload(body, actorUserId);
  }
}
