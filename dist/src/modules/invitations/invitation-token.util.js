"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvitationToken = generateInvitationToken;
exports.hashInvitationToken = hashInvitationToken;
const node_crypto_1 = require("node:crypto");
function generateInvitationToken() {
    const token = (0, node_crypto_1.randomBytes)(32).toString("base64url");
    return { token, tokenHash: hashInvitationToken(token) };
}
function hashInvitationToken(token) {
    return (0, node_crypto_1.createHash)("sha256").update(token.trim()).digest("hex");
}
//# sourceMappingURL=invitation-token.util.js.map