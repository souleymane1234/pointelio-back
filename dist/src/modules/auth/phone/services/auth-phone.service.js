"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPhoneService = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../../../../common/i18n");
const response_util_1 = require("../../../../common/utils/response.util");
const phone_util_1 = require("../../../../common/utils/phone.util");
let AuthPhoneService = class AuthPhoneService {
    normalizeRequiringDialCode(phone, locale) {
        const normalized = (0, phone_util_1.normalizePhoneE164)(phone);
        if (!normalized) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "phoneDialCodeRequired")], undefined, locale));
        }
        return normalized;
    }
};
exports.AuthPhoneService = AuthPhoneService;
exports.AuthPhoneService = AuthPhoneService = __decorate([
    (0, common_1.Injectable)()
], AuthPhoneService);
//# sourceMappingURL=auth-phone.service.js.map