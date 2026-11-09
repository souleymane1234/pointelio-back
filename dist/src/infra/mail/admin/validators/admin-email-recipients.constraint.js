"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEmailHasRecipientsConstraint = void 0;
const class_validator_1 = require("class-validator");
let AdminEmailHasRecipientsConstraint = class AdminEmailHasRecipientsConstraint {
    validate(_value, args) {
        const dto = args.object;
        const userCount = dto.userIds?.length ?? 0;
        const emailCount = dto.emails?.length ?? 0;
        return userCount + emailCount > 0;
    }
    defaultMessage() {
        return "Provide at least one recipient via userIds and/or emails.";
    }
};
exports.AdminEmailHasRecipientsConstraint = AdminEmailHasRecipientsConstraint;
exports.AdminEmailHasRecipientsConstraint = AdminEmailHasRecipientsConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: "adminEmailHasRecipients", async: false })
], AdminEmailHasRecipientsConstraint);
//# sourceMappingURL=admin-email-recipients.constraint.js.map