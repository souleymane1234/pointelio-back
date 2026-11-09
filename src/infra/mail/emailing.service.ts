import { Injectable } from "@nestjs/common";
import {
  EmailingSendService,
  type SendEmailInput,
  type SendEmailResult,
} from "./send/services/emailing-send.service";

@Injectable()
export class EmailingService {
  constructor(private readonly emailingSend: EmailingSendService) {}

  isEnabled(): boolean {
    return this.emailingSend.isEnabled();
  }

  async send(dto: SendEmailInput): Promise<SendEmailResult> {
    return this.emailingSend.send(dto);
  }
}
