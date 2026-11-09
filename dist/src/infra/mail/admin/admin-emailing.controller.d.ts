import { AdminSendEmailDto } from "./dto/admin-send-email.dto";
import { AdminEmailingService } from "./services/admin-emailing.service";
import { type AuthedRequest } from "../../../common/types/request-context";
export declare class AdminEmailingController {
    private readonly adminEmailing;
    constructor(adminEmailing: AdminEmailingService);
    send(req: AuthedRequest, dto: AdminSendEmailDto): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<import("./services/admin-emailing.service").AdminSendEmailResult>>;
}
