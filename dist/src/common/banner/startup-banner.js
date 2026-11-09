"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderStartupBanner = renderStartupBanner;
exports.printStartupBanner = printStartupBanner;
const app_constants_1 = require("../constants/app.constants");
const ANSI = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    green: "\x1b[32m",
};
function shouldUseColors() {
    return Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
}
function renderStartupBanner(info) {
    const useColors = info.colors ?? shouldUseColors();
    const paint = (code, text) => useColors ? `${code}${text}${ANSI.reset}` : text;
    const baseUrl = `http://localhost:${info.port}`;
    const rows = [
        ["App", app_constants_1.APP_NAME],
        ["API", `${baseUrl}/api/v1`],
        ...(info.swaggerEnabled
            ? [
                ["Swagger", `${baseUrl}/api/v1/docs`],
                ["Swagger mobile", `${baseUrl}/api/v1/docs/mobile`],
            ]
            : []),
        ["Health", `${baseUrl}/api/v1/health/ready`],
        ["Socket.IO", `${baseUrl}/realtime`],
        ["Env", info.environment],
        ["Node", process.version],
    ];
    const labelWidth = Math.max(...rows.map(([label]) => label.length));
    const startedAt = (info.startedAt ?? new Date()).toString();
    return [
        "",
        paint(ANSI.bold, "Welcome!"),
        "",
        ...rows.map(([label, value]) => `  ${paint(ANSI.dim, label.padEnd(labelWidth))}  ${paint(ANSI.green, value)}`),
        "",
        paint(ANSI.dim, `Started: ${startedAt}`),
        "",
    ].join("\n");
}
function printStartupBanner(info) {
    console.log(renderStartupBanner(info));
}
//# sourceMappingURL=startup-banner.js.map