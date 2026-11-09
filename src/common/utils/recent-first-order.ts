/** Listes paginées : dernière modification, puis création, puis id stable. */
export const recentFirstOrderBy = [
  { updatedAt: "desc" as const },
  { createdAt: "desc" as const },
  { id: "desc" as const },
];
