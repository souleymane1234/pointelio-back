import { type AuthedRequest } from "../../common/types/request-context";
import { AcceptInvitationDto, InvitationTokenDto } from "./dto/invitation.dto";
import { InvitationsService } from "./invitations.service";
export declare class InvitationsController {
    private readonly invitations;
    constructor(invitations: InvitationsService);
    verifier(req: AuthedRequest, dto: InvitationTokenDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        email: string;
        role: import("@prisma/client").$Enums.Role;
        expireAt: Date;
        entreprise: string;
    }>>;
    accepter(req: AuthedRequest, dto: AcceptInvitationDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    renvoyer(req: AuthedRequest, utilisateurId: number): Promise<import("../../common/interfaces/response.interface").SuccessResponse<import("./invitations.service").InvitationResult>>;
    private locale;
}
