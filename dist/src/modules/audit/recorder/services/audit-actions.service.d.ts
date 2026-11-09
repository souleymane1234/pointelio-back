import { Prisma } from "@prisma/client";
import { type AuditActionCode, type AuditObjet } from "../../shared/audit-actions.constants";
import { AuditTrailRecorderService } from "./audit-trail-recorder.service";
type TargetUser = {
    id: number;
    entrepriseId: number | null;
};
export declare class AuditActionsService {
    private readonly recorder;
    constructor(recorder: AuditTrailRecorderService);
    authLogin(acteurId: number, details?: Prisma.InputJsonValue): Promise<void>;
    authRefreshToken(acteurId: number, details?: Prisma.InputJsonValue): Promise<void>;
    authLogout(acteurId: number, details?: Prisma.InputJsonValue): Promise<void>;
    authPasswordReset(acteurId: number, details?: Prisma.InputJsonValue): Promise<void>;
    authAccountDeactivate(acteurId: number, details?: Prisma.InputJsonValue): Promise<void>;
    profileUpdated(acteurId: number, details?: Prisma.InputJsonValue): Promise<void>;
    adminUserCreated(acteurId: number, target: TargetUser, details?: Prisma.InputJsonValue): Promise<void>;
    adminUserUpdated(acteurId: number, target: TargetUser, details?: Prisma.InputJsonValue): Promise<void>;
    adminRoleChanged(acteurId: number, target: TargetUser, details?: Prisma.InputJsonValue): Promise<void>;
    adminUserSuspended(acteurId: number, target: TargetUser, details?: Prisma.InputJsonValue): Promise<void>;
    adminUserRestored(acteurId: number, target: TargetUser, details?: Prisma.InputJsonValue): Promise<void>;
    adminUserReassigned(acteurId: number, target: TargetUser, details?: Prisma.InputJsonValue): Promise<void>;
    adminUserFired(acteurId: number, target: TargetUser, details?: Prisma.InputJsonValue): Promise<void>;
    adminNotificationSent(acteurId: number, entrepriseId: number | null | undefined, details?: Prisma.InputJsonValue): Promise<void>;
    auditExported(acteurId: number, details?: Prisma.InputJsonValue): Promise<void>;
    fileUploaded(acteurId: number, filePublicId: string, details?: Prisma.InputJsonValue): Promise<void>;
    domainAction(input: {
        acteurId: number;
        action: AuditActionCode;
        objet: AuditObjet;
        objetId: number | string;
        entrepriseId: number | null;
        details?: Prisma.InputJsonValue;
    }): Promise<void>;
    private selfAction;
    private userAction;
}
export {};
