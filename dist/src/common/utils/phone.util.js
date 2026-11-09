"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhoneInput = normalizePhoneInput;
exports.normalizePhoneE164 = normalizePhoneE164;
exports.phoneSearchContainsTerms = phoneSearchContainsTerms;
exports.resolveUserSearchTerm = resolveUserSearchTerm;
const E164_MIN_DIGITS = 8;
const E164_MAX_DIGITS = 15;
function normalizePhoneInput(raw) {
    return raw.trim().replace(/[\s\-.]/g, "");
}
function normalizePhoneE164(raw) {
    let phone = normalizePhoneInput(raw);
    if (phone.startsWith("00"))
        phone = `+${phone.slice(2)}`;
    if (!phone.startsWith("+"))
        return null;
    const digits = phone.slice(1);
    if (!/^[1-9]\d+$/.test(digits))
        return null;
    if (digits.length < E164_MIN_DIGITS || digits.length > E164_MAX_DIGITS) {
        return null;
    }
    return `+${digits}`;
}
function phoneSearchContainsTerms(raw) {
    const trimmed = String(raw ?? "").trim();
    if (!trimmed || /[a-zA-Z@]/.test(trimmed))
        return [];
    const digits = normalizePhoneInput(trimmed).replace(/\D/g, "");
    if (digits.length < E164_MIN_DIGITS)
        return [];
    return [digits];
}
function resolveUserSearchTerm(raw) {
    const trimmed = String(raw ?? "").trim();
    if (!trimmed)
        return "";
    if (/[a-zA-Z@]/.test(trimmed))
        return trimmed;
    return normalizePhoneInput(trimmed);
}
//# sourceMappingURL=phone.util.js.map