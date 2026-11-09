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
exports.UserIdentifiersService = void 0;
const common_1 = require("@nestjs/common");
const phone_util_1 = require("../../../common/utils/phone.util");
const i18n_1 = require("../../../common/i18n");
const response_util_1 = require("../../../common/utils/response.util");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
let UserIdentifiersService = class UserIdentifiersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeTelephone(raw, locale) {
        const telephone = (0, phone_util_1.normalizePhoneE164)(raw);
        if (!telephone) {
            throw this.invalid("phoneDialCodeRequired", locale);
        }
        return telephone;
    }
    async assertAvailable(values, locale, excludeId) {
        const notSelf = excludeId ? { NOT: { id: excludeId } } : {};
        const [email, telephone, matricule] = await Promise.all([
            values.email
                ? this.prisma.utilisateur.findFirst({
                    where: { email: values.email, ...notSelf },
                    select: { id: true },
                })
                : null,
            values.telephone
                ? this.prisma.utilisateur.findFirst({
                    where: { telephone: values.telephone, ...notSelf },
                    select: { id: true },
                })
                : null,
            values.matricule
                ? this.prisma.utilisateur.findFirst({
                    where: {
                        matricule: values.matricule,
                        entrepriseId: values.entrepriseId,
                        ...notSelf,
                    },
                    select: { id: true },
                })
                : null,
        ]);
        if (email)
            throw this.invalid("emailAlreadyUsed", locale);
        if (telephone)
            throw this.invalid("phoneAlreadyUsed", locale);
        if (matricule)
            throw this.invalid("matriculeAlreadyUsed", locale);
    }
    invalid(key, locale) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key)], undefined, locale));
    }
};
exports.UserIdentifiersService = UserIdentifiersService;
exports.UserIdentifiersService = UserIdentifiersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserIdentifiersService);
//# sourceMappingURL=user-identifiers.service.js.map