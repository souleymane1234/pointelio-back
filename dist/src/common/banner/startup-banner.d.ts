export type StartupBannerInfo = {
    port: number | string;
    environment: string;
    swaggerEnabled: boolean;
    startedAt?: Date;
    colors?: boolean;
};
export declare function renderStartupBanner(info: StartupBannerInfo): string;
export declare function printStartupBanner(info: StartupBannerInfo): void;
