"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditActionsService = void 0;
const common_1 = require("@nestjs/common");
const audit_actions_constants_1 = require("../../shared/audit-actions.constants");
const audit_trail_recorder_service_1 = require("./audit-trail-recorder.service");
let AuditActionsService = class AuditActionsService {
    recorder;
    constructor(recorder) {
        this.recorder = recorder;
    }
    authLogin(acteurId, details) {
        return this.selfAction(audit_actions_constants_1.AUDIT_ACTIONS.CONNEXION, acteurId, details);
    }
    authRefreshToken(acteurId, details) {
        return this.selfAction(audit_actions_constants_1.AUDIT_ACTIONS.TOKEN_RENOUVELE, acteurId, details);
    }
    authLogout(acteurId, details) {
        return this.selfAction(audit_actions_constants_1.AUDIT_ACTIONS.DECONNEXION, acteurId, details);
    }
    authPasswordReset(acteurId, details) {
        return this.selfAction(audit_actions_constants_1.AUDIT_ACTIONS.MOT_DE_PASSE_REINITIALISE, acteurId, details);
    }
    authAccountDeactivate(acteurId, details) {
        return this.selfAction(audit_actions_constants_1.AUDIT_ACTIONS.COMPTE_DESACTIVE, acteurId, details);
    }
    profileUpdated(acteurId, details) {
        return this.selfAction(audit_actions_constants_1.AUDIT_ACTIONS.PROFIL_MODIFIE, acteurId, details);
    }
    adminUserCreated(acteurId, target, details) {
        return this.userAction(audit_actions_constants_1.AUDIT_ACTIONS.UTILISATEUR_CREE, acteurId, target, details);
    }
    adminUserUpdated(acteurId, target, details) {
        return this.userAction(audit_actions_constants_1.AUDIT_ACTIONS.UTILISATEUR_MODIFIE, acteurId, target, details);
    }
    adminRoleChanged(acteurId, target, details) {
        return this.userAction(audit_actions_constants_1.AUDIT_ACTIONS.ROLE_MODIFIE, acteurId, target, details);
    }
    adminUserSuspended(acteurId, target, details) {
        return this.userAction(audit_actions_constants_1.AUDIT_ACTIONS.SUSPENSION, acteurId, target, details);
    }
    adminUserRestored(acteurId, target, details) {
        return this.userAction(audit_actions_constants_1.AUDIT_ACTIONS.REACTIVATION, acteurId, target, details);
    }
    adminUserReassigned(acteurId, target, details) {
        return this.userAction(audit_actions_constants_1.AUDIT_ACTIONS.EMPLOYE_REAFFECTE, acteurId, target, details);
    }
    adminUserFired(acteurId, target, details) {
        return this.userAction(audit_actions_constants_1.AUDIT_ACTIONS.EMPLOYE_RENVOYE, acteurId, target, details);
    }
    adminNotificationSent(acteurId, entrepriseId, details) {
        return this.recorder.recordAction({
            acteurId,
            entrepriseId,
            action: audit_actions_constants_1.AUDIT_ACTIONS.NOTIFICATION_ENVOYEE,
            objet: audit_actions_constants_1.AUDIT_OBJETS.NOTIFICATION,
            details,
        });
    }
    auditExported(acteurId, details) {
        return this.recorder.recordAction({
            acteurId,
            action: audit_actions_constants_1.AUDIT_ACTIONS.EXPORT,
            objet: audit_actions_constants_1.AUDIT_OBJETS.AUDIT,
            details,
        });
    }
    fileUploaded(acteurId, filePublicId, details) {
        return this.recorder.recordAction({
            acteurId,
            action: audit_actions_constants_1.AUDIT_ACTIONS.FICHIER_UPLOADE,
            objet: audit_actions_constants_1.AUDIT_OBJETS.FICHIER,
            objetId: filePublicId,
            details,
        });
    }
    domainAction(input) {
        return this.recorder.recordAction(input);
    }
    selfAction(action, acteurId, details) {
        return this.recorder.recordAction({
            acteurId,
            action,
            objet: audit_actions_constants_1.AUDIT_OBJETS.UTILISATEUR,
            objetId: acteurId,
            details,
        });
    }
    userAction(action, acteurId, target, details) {
        return this.recorder.recordAction({
            acteurId,
            entrepriseId: target.entrepriseId,
            action,
            objet: audit_actions_constants_1.AUDIT_OBJETS.UTILISATEUR,
            objetId: target.id,
            details,
        });
    }
};
exports.AuditActionsService = AuditActionsService;
exports.AuditActionsService = AuditActionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_trail_recorder_service_1.AuditTrailRecorderService])
], AuditActionsService);
//# sourceMappingURL=audit-actions.service.js.map