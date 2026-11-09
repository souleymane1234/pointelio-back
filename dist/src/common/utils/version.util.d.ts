import { VersionConfig, VersionCheckResult } from "../interfaces/version.interface";
export declare const compareVersions: (v1: string, v2: string) => number;
export declare const checkAppVersion: (platform: "ios" | "android", version: string, _bypassUpdate: boolean, config: VersionConfig, _isFirstRequest?: boolean, languageHeader?: string) => VersionCheckResult;
