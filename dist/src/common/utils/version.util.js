"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAppVersion = exports.compareVersions = void 0;
const i18n_1 = require("../i18n");
const compareVersions = (v1, v2) => {
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = parts1[i] || 0;
        const part2 = parts2[i] || 0;
        if (part1 < part2)
            return -1;
        if (part1 > part2)
            return 1;
    }
    return 0;
};
exports.compareVersions = compareVersions;
const checkAppVersion = (platform, version, _bypassUpdate, config, _isFirstRequest = false, languageHeader) => {
    const locale = (0, i18n_1.normalizeLocale)(languageHeader);
    const platformConfig = config[platform];
    if (!platformConfig) {
        return {
            shouldBlock: true,
            can_bypass: false,
            message: (0, i18n_1.translate)(locale, "platformUnsupported", { platform }),
        };
    }
    const { min_version: allowedVersion } = platformConfig;
    if ((0, exports.compareVersions)(version, allowedVersion) === 0) {
        return {
            shouldBlock: false,
            can_bypass: false,
            message: "",
        };
    }
    return {
        shouldBlock: true,
        can_bypass: false,
        message: (0, i18n_1.translate)(locale, "updateMandatory", {
            minVersion: allowedVersion,
        }),
    };
};
exports.checkAppVersion = checkAppVersion;
//# sourceMappingURL=version.util.js.map