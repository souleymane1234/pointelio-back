import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { ApiEndpoint } from "../../common/decorators/api-endpoint.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { normalizeLocale, translate } from "../../common/i18n";
import { USER_MANAGER_ROLES } from "../../common/rbac/role-groups";
import { authThrottleOptions } from "../../common/throttler/throttler.constants";
import {
  type AuthedRequest,
  requireUser,
} from "../../common/types/request-context";
import { successResponse } from "../../common/utils/response.util";
import { AuthRegisterLoginResponseSchemaDto } from "../auth/session/dto/auth-response.dto";
import { authSuccessData } from "../auth/session/utils/auth-response-mobile.util";
import { AcceptInvitationDto, InvitationTokenDto } from "./dto/invitation.dto";
import { InvitationsService } from "./invitations.service";

@ApiTags("Invitations")
@Controller("invitations")
export class InvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Public()
  @Post("verifier")
  @Throttle(authThrottleOptions())
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint({
    summary: "Vérifier un lien d'activation",
    audience: "mobile",
    description:
      "Lien d'activation reçu par **e-mail** (pas de SMS ni d'OTP). Renvoie l'e-mail, le rôle et l'entreprise pour l'écran d'activation.",
    invalid: "Lien invalide, expiré ou déjà utilisé",
  })
  async verifier(@Req() req: AuthedRequest, @Body() dto: InvitationTokenDto) {
    const locale = this.locale(req);
    const data = await this.invitations.verifier(dto.token, locale);
    return successResponse(
      translate(locale, "invitationFetched"),
      data,
      locale,
    );
  }

  @Public()
  @Post("accepter")
  @Throttle(authThrottleOptions())
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint({
    summary: "Activer son compte",
    audience: "mobile",
    description:
      "Définit le PIN / mot de passe, passe le compte au statut ACTIF et renvoie les tokens. EMPLOYE / SURVEILLANT : PIN de 4 chiffres.",
    schema: AuthRegisterLoginResponseSchemaDto,
    invalid: "Lien invalide ou mot de passe non conforme",
  })
  async accepter(@Req() req: AuthedRequest, @Body() dto: AcceptInvitationDto) {
    const locale = this.locale(req);
    const result = await this.invitations.accepter(
      dto.token,
      dto.password,
      locale,
    );
    return successResponse(
      translate(locale, "invitationAccepted"),
      authSuccessData(result),
      locale,
    );
  }

  @Post("utilisateurs/:utilisateurId/renvoyer")
  @ApiBearerAuth()
  @Roles(...USER_MANAGER_ROLES)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint({
    summary: "Renvoyer l'invitation d'un compte",
    audience: ["employeur", "plateforme"],
    description:
      "Renvoie le **lien d'activation par e-mail** (pas de SMS). Remplace l'invitation en cours. Le compte doit être INVITE et avoir un e-mail.",
    notFound: "Utilisateur introuvable ou hors périmètre",
    invalid: "Compte déjà activé ou sans e-mail",
  })
  async renvoyer(
    @Req() req: AuthedRequest,
    @Param("utilisateurId", ParseIntPipe) utilisateurId: number,
  ) {
    const locale = this.locale(req);
    const data = await this.invitations.renvoyer(
      requireUser(req),
      utilisateurId,
      locale,
    );
    return successResponse(translate(locale, "invitationSent"), data, locale);
  }

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
