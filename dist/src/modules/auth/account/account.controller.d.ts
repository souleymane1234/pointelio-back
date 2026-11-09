import { DeactivateAccountService } from "./services/deactivate-account.service";
import { type AuthedRequest } from "../../../common/types/request-context";
export declare class AuthAccountController {
    private readonly deactivateAccountService;
    constructor(deactivateAccountService: DeactivateAccountService);
    deactivateAccount(req: AuthedRequest): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<undefined>>;
}
