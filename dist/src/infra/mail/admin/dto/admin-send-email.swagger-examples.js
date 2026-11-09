"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_SEND_EMAIL_SWAGGER_EXAMPLES = void 0;
exports.ADMIN_SEND_EMAIL_SWAGGER_EXAMPLES = {
    parUserIds: {
        summary: "Destinataires via userIds (base)",
        description: "Les e-mails sont résolus depuis les utilisateurs actifs (non supprimés). Remplace les IDs par des `cuid` réels.",
        value: {
            userIds: [12],
            subject: "Message administrateur",
            text: "Bonjour,\n\nCeci est un message envoyé depuis l’admin.\n\n— L’équipe",
        },
    },
    parEmailsTest: {
        summary: "Destinataires via emails (tests)",
        description: "Utile pour tester le SMTP sans passer par la base : une ou plusieurs adresses libres.",
        value: {
            emails: ["qa.test@example.com"],
            subject: "[Test] SMTP — OK",
            html: "<p>Bonjour,</p><p>Ceci est un <strong>e-mail de test</strong> depuis Swagger.</p>",
        },
    },
    mixteHtml: {
        summary: "userIds + emails + HTML",
        description: "Fusion des destinataires (dédoublonnage par adresse). Optionnel : cc, replyTo, fromName.",
        value: {
            userIds: [12],
            emails: ["copie.test@example.com"],
            subject: "Information importante",
            html: "<p>Bonjour,</p><p>Votre demande a bien été prise en compte.</p>",
            cc: ["support@example.com"],
            replyTo: "noreply@example.com",
            fromName: "App",
        },
    },
};
//# sourceMappingURL=admin-send-email.swagger-examples.js.map