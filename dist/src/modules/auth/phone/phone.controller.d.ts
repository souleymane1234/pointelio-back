import type { Request } from "express";
import { PhoneLoginDto } from "./dto/phone-login.dto";
import { LoginService } from "../session/services/login.service";
export declare class AuthPhoneController {
    private readonly loginService;
    constructor(loginService: LoginService);
    login(req: Request, dto: PhoneLoginDto): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
        user: {
            telephone: string | null;
            email: string | null;
            id: number;
            entrepriseId: number | null;
            siteId: number | null;
            matricule: string | null;
            nom: string;
            prenom: string;
            role: import("@prisma/client").$Enums.Role;
            poste: string | null;
            photoUrl: string | null;
        };
        access_token: string;
        refresh_token: string;
    }>>;
}
