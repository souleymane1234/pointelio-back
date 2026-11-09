export declare const NOTIFICATION_TYPES: {
    readonly ADMIN_BROADCAST: "ADMIN_BROADCAST";
    readonly SYSTEM: "SYSTEM";
    readonly DEMANDE: "DEMANDE";
};
export type NotificationTypeCode = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
