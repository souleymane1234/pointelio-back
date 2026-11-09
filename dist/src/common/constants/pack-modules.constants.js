"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACK_MODULE_VALUES = exports.PACK_MODULES = void 0;
exports.isPackModule = isPackModule;
exports.PACK_MODULES = {
    QR: "QR",
    GPS: "GPS",
    CONGES: "CONGES",
    HORAIRES_MULTIPLES: "HORAIRES_MULTIPLES",
    MULTI_SITES: "MULTI_SITES",
    RAPPORTS_AVANCES: "RAPPORTS_AVANCES",
    ROLES_AVANCES: "ROLES_AVANCES",
    SURVEILLANT: "SURVEILLANT",
};
exports.PACK_MODULE_VALUES = Object.values(exports.PACK_MODULES);
function isPackModule(value) {
    return (typeof value === "string" &&
        exports.PACK_MODULE_VALUES.includes(value));
}
//# sourceMappingURL=pack-modules.constants.js.map