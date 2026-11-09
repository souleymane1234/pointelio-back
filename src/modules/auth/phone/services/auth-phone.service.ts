import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { translate, type Locale } from "../../../../common/i18n";
import { validationErrorResponse } from "../../../../common/utils/response.util";
import { normalizePhoneE164 } from "../../../../common/utils/phone.util";

@Injectable()
export class AuthPhoneService {
  /** Normalise un numéro au format E.164 en exigeant l'indicatif pays (`+33...`). */
  normalizeRequiringDialCode(phone: string, locale: Locale): string {
    const normalized = normalizePhoneE164(phone);
    if (!normalized) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "phoneDialCodeRequired")],
          undefined,
          locale,
        ),
      );
    }
    return normalized;
  }
}
