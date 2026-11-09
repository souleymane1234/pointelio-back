export interface VersionConfig {
    ios: {
        current_version: string;
        min_version: string;
    };
    android: {
        current_version: string;
        min_version: string;
    };
}
export interface VersionCheckResult {
    shouldBlock: boolean;
    can_bypass: boolean;
    message: string;
}
