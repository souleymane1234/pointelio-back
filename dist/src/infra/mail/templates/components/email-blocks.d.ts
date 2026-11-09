export type SummaryRowInput = {
    label: string;
    value: string;
    valueIsHtml?: boolean;
};
export declare function summaryRow(row: SummaryRowInput): string;
export declare function summaryBlock(title: string, rows: SummaryRowInput[]): string;
export type ActionButtonInput = {
    href: string;
    label: string;
    variant?: "primary" | "danger";
};
export declare function actionButton({ href, label, variant, }: ActionButtonInput): string;
export type AlertVariant = "danger" | "warning";
export declare function replyExcerptBox(text: string): string;
export declare function alertBox(variant: AlertVariant, message: string): string;
