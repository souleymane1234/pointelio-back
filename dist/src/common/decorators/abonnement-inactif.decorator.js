"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoriseAbonnementInactif = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../constants/auth.constants");
const AutoriseAbonnementInactif = () => (0, common_1.SetMetadata)(auth_constants_1.ABONNEMENT_INACTIF_AUTORISE_KEY, true);
exports.AutoriseAbonnementInactif = AutoriseAbonnementInactif;
//# sourceMappingURL=abonnement-inactif.decorator.js.map