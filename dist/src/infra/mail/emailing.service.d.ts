import { EmailingSendService, type SendEmailInput, type SendEmailResult } from "./send/services/emailing-send.service";
export declare class EmailingService {
    private readonly emailingSend;
    constructor(emailingSend: EmailingSendService);
    isEnabled(): boolean;
    send(dto: SendEmailInput): Promise<SendEmailResult>;
}
