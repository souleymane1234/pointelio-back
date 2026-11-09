/** Durée de vie du JWT access en secondes (priorité : minutes, sinon jours legacy). */
export function getJwtAccessExpiresInSeconds(): number {
  const minutes = Number(process.env.JWT_ACCESS_EXPIRES_IN_MINUTES);
  if (Number.isFinite(minutes) && minutes > 0) {
    return minutes * 60;
  }
  return (Number(process.env.JWT_EXPIRES_IN_DAYS) || 7) * 24 * 60 * 60;
}

export function getJwtAccessExpiresInMinutes(): number {
  return Math.max(1, Math.ceil(getJwtAccessExpiresInSeconds() / 60));
}

export function getJwtRefreshExpiresInSeconds(): number {
  return (Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS) || 30) * 24 * 60 * 60;
}

/**
 * Fenêtre « connectés » : durée exacte de l'access JWT (login ou refresh récent requis).
 */
export function getConnectedUsersWithinMinutes(): number {
  return getJwtAccessExpiresInMinutes();
}
