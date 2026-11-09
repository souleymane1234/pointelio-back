/** Valeurs de `Notification.type` (colonne texte : nouveaux types sans migration). */
export const NOTIFICATION_TYPES = {
  ADMIN_BROADCAST: "ADMIN_BROADCAST",
  SYSTEM: "SYSTEM",
  DEMANDE: "DEMANDE",
} as const;

export type NotificationTypeCode =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
