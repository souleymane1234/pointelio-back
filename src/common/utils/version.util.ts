import { normalizeLocale, translate, type Locale } from "../i18n";
import {
  VersionConfig,
  VersionCheckResult,
} from "../interfaces/version.interface";

/**
 * Compare deux versions au format x.x.x
 * Retourne: -1 si v1 < v2, 0 si v1 == v2, 1 si v1 > v2
 */
export const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }

  return 0;
};

/**
 * Vérifie si la version de l'app est autorisée.
 * Règle stricte : seule la version configurée (`min_version` / env *_MIN_VERSION)
 * est acceptée. Toute autre version (plus ancienne ou plus récente) est bloquée.
 * Le bypass-update ne permet pas de contourner cette règle.
 */
export const checkAppVersion = (
  platform: "ios" | "android",
  version: string,
  _bypassUpdate: boolean,
  config: VersionConfig,
  _isFirstRequest: boolean = false,
  languageHeader?: string,
): VersionCheckResult => {
  const locale: Locale = normalizeLocale(languageHeader);
  const platformConfig = config[platform];

  if (!platformConfig) {
    return {
      shouldBlock: true,
      can_bypass: false,
      message: translate(locale, "platformUnsupported", { platform }),
    };
  }

  const { min_version: allowedVersion } = platformConfig;

  if (compareVersions(version, allowedVersion) === 0) {
    return {
      shouldBlock: false,
      can_bypass: false,
      message: "",
    };
  }

  return {
    shouldBlock: true,
    can_bypass: false,
    message: translate(locale, "updateMandatory", {
      minVersion: allowedVersion,
    }),
  };
};
