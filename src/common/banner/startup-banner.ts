import { APP_NAME } from "../constants/app.constants";

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
} as const;

export type StartupBannerInfo = {
  port: number | string;
  environment: string;
  swaggerEnabled: boolean;
  /** Date de démarrage affichée en dernière ligne. */
  startedAt?: Date;
  /** Couleurs ANSI ; désactivées par défaut hors TTY ou si NO_COLOR est défini. */
  colors?: boolean;
};

function shouldUseColors(): boolean {
  return Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
}

/** Bannière de démarrage : message d'accueil et URLs utiles. */
export function renderStartupBanner(info: StartupBannerInfo): string {
  const useColors = info.colors ?? shouldUseColors();
  const paint = (code: string, text: string) =>
    useColors ? `${code}${text}${ANSI.reset}` : text;

  const baseUrl = `http://localhost:${info.port}`;
  const rows: Array<[string, string]> = [
    ["App", APP_NAME],
    ["API", `${baseUrl}/api/v1`],
    ...(info.swaggerEnabled
      ? ([
          ["Swagger", `${baseUrl}/api/v1/docs`],
          ["Swagger mobile", `${baseUrl}/api/v1/docs/mobile`],
        ] as Array<[string, string]>)
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
    ...rows.map(
      ([label, value]) =>
        `  ${paint(ANSI.dim, label.padEnd(labelWidth))}  ${paint(ANSI.green, value)}`,
    ),
    "",
    paint(ANSI.dim, `Started: ${startedAt}`),
    "",
  ].join("\n");
}

export function printStartupBanner(info: StartupBannerInfo): void {
  console.log(renderStartupBanner(info));
}
