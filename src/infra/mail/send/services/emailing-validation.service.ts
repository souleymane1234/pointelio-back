import { BadRequestException, Injectable } from "@nestjs/common";
import { SendEmailDto } from "../dto/send-email.dto";

@Injectable()
export class EmailingValidationService {
  validateSendPayload(payload: SendEmailDto): void {
    if (!payload.text?.trim() && !payload.html?.trim()) {
      throw new BadRequestException(
        "Email body is required. Provide text or html content.",
      );
    }
  }
}
