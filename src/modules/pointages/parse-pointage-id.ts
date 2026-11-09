import { NotFoundException } from "@nestjs/common";
import { translate, type Locale } from "../../common/i18n";

export function parsePointageId(raw: string, locale: Locale): bigint {
  if (!/^\d+$/.test(raw)) {
    throw new NotFoundException(translate(locale, "pointageNotFound"));
  }
  return BigInt(raw);
}
