import type { Request } from "express";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { LogoutDto } from "./dto/logout.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { LoginService } from "./services/login.service";
import { LogoutService } from "./services/logout.service";
import { TokenService } from "./services/token.service";
export declare class AuthSessionController {
    private readonly loginService;
    private readonly logoutService;
    private readonly tokenService;
    constructor(loginService: LoginService, logoutService: LogoutService, tokenService: TokenService);
    loginAdmin(req: Request, dto: AdminLoginDto): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
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
    refreshToken(req: Request, dto: RefreshTokenDto): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
        access_token: string;
        refresh_token: string;
    }>>;
    logout(req: Request, userId: number, dto: LogoutDto): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<undefined>>;
}
