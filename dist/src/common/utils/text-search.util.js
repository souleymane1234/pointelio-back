"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foldSearchText = foldSearchText;
exports.textIncludesQuery = textIncludesQuery;
exports.textRelevanceScore = textRelevanceScore;
function foldSearchText(value) {
    return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}
function textIncludesQuery(query, ...fields) {
    const q = foldSearchText(query);
    if (!q)
        return true;
    return fields.some((field) => foldSearchText(field ?? "").includes(q));
}
function textRelevanceScore(query, ...fields) {
    const q = foldSearchText(query);
    if (!q)
        return 1;
    let best = 0;
    for (const field of fields) {
        const hay = foldSearchText(field ?? "");
        if (!hay)
            continue;
        if (hay.startsWith(q))
            best = Math.max(best, 100);
        else if (hay.includes(q))
            best = Math.max(best, 60);
        else if (hay.length >= 3 && q.includes(hay))
            best = Math.max(best, 40);
    }
    return best;
}
//# sourceMappingURL=text-search.util.js.map