import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { normalizePhoneE164 } from "../../../common/utils/phone.util";
import { translate, type Locale } from "../../../common/i18n";
import type { MessageKey } from "../../../common/i18n/translate";
import { validationErrorResponse } from "../../../common/utils/response.util";
import { PrismaService } from "../../../infra/prisma/prisma.service";

/** Unicité des identifiants : e-mail et téléphone globaux, matricule par entreprise. */
@Injectable()
export class UserIdentifiersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Téléphone E.164 ; 422 si l'indicatif pays manque. */
  normalizeTelephone(raw: string, locale: Locale): string {
    const telephone = normalizePhoneE164(raw);
    if (!telephone) {
      throw this.invalid("phoneDialCodeRequired", locale);
    }
    return telephone;
  }

  async assertAvailable(
    values: {
      email?: string | null;
      telephone?: string | null;
      matricule?: string | null;
      entrepriseId: number | null;
    },
    locale: Locale,
    excludeId?: number,
  ): Promise<void> {
    const notSelf = excludeId ? { NOT: { id: excludeId } } : {};
    const [email, telephone, matricule] = await Promise.all([
      values.email
        ? this.prisma.utilisateur.findFirst({
            where: { email: values.email, ...notSelf },
            select: { id: true },
          })
        : null,
      values.telephone
        ? this.prisma.utilisateur.findFirst({
            where: { telephone: values.telephone, ...notSelf },
            select: { id: true },
          })
        : null,
      values.matricule
        ? this.prisma.utilisateur.findFirst({
            where: {
              matricule: values.matricule,
              entrepriseId: values.entrepriseId,
              ...notSelf,
            },
            select: { id: true },
          })
        : null,
    ]);

    if (email) throw this.invalid("emailAlreadyUsed", locale);
    if (telephone) throw this.invalid("phoneAlreadyUsed", locale);
    if (matricule) throw this.invalid("matriculeAlreadyUsed", locale);
  }

  private invalid(key: MessageKey, locale: Locale) {
    return new UnprocessableEntityException(
      validationErrorResponse([translate(locale, key)], undefined, locale),
    );
  }
}
