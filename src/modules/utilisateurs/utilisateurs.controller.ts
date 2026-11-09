import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { ApiAudience } from "../../common/decorators/api-audience.decorator";
import { StatutCompte } from "@prisma/client";
import { normalizeLocale, translate } from "../../common/i18n";
import { USER_MANAGER_ROLES } from "../../common/rbac/role-groups";
import { Roles } from "../../common/decorators/roles.decorator";
import {
  paginatedResponse,
  successResponse,
} from "../../common/utils/response.util";
import {
  ApiCreateUser,
  ApiGetUser,
  ApiListUsers,
  ApiReactiverUser,
  ApiReaffecterUser,
  ApiRenvoyerUser,
  ApiSuspendreUser,
  ApiUpdateUser,
} from "./decorators/api-user.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { MotifRhDto, ReaffecterEmployeDto } from "./dto/rh-actions.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersQueryDto } from "./dto/users-query.dto";
import { UtilisateursService } from "./services/utilisateurs.service";
import {
  type AuthedRequest,
  requireUser,
} from "../../common/types/request-context";

@ApiTags("Admin — Utilisateurs")
@ApiAudience("employeur", "plateforme")
@ApiExtraModels(CreateUserDto, UpdateUserDto, ReaffecterEmployeDto, MotifRhDto)
@ApiBearerAuth()
@Roles(...USER_MANAGER_ROLES)
@Controller("admin/users")
export class UtilisateursController {
  constructor(private readonly usersService: UtilisateursService) {}

  @Get()
  @ApiListUsers()
  async findAll(@Req() req: AuthedRequest, @Query() query: UsersQueryDto) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const { data, pagination } = await this.usersService.findAll(
      requireUser(req),
      query,
    );
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "usersFetched"),
      locale,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateUser()
  async create(@Req() req: AuthedRequest, @Body() dto: CreateUserDto) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.usersService.create(requireUser(req), dto, locale);
    return successResponse(translate(locale, "userCreated"), data, locale);
  }

  @Get(":id")
  @ApiGetUser()
  async findOne(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.usersService.findOne(requireUser(req), id, locale);
    return successResponse(translate(locale, "userFetched"), data, locale);
  }

  @Patch(":id")
  @ApiUpdateUser()
  async update(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.usersService.update(
      requireUser(req),
      id,
      dto,
      locale,
    );
    const definedKeys = Object.entries(dto as Record<string, unknown>)
      .filter(([, value]) => value !== undefined)
      .map(([key]) => key);
    const isStatusToggleOnly =
      definedKeys.includes("statut") &&
      definedKeys.every(
        (key) => key === "statut" || key === "suspensionReason",
      );
    const messageKey =
      isStatusToggleOnly && dto.statut === StatutCompte.SUSPENDU
        ? "userSuspended"
        : isStatusToggleOnly && dto.statut === StatutCompte.ACTIF
          ? "userRestored"
          : isStatusToggleOnly && dto.statut === StatutCompte.DESACTIVE
            ? "userFired"
            : "userUpdated";
    return successResponse(translate(locale, messageKey), data, locale);
  }

  @Post(":id/reaffecter")
  @HttpCode(HttpStatus.OK)
  @ApiReaffecterUser()
  async reaffecter(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ReaffecterEmployeDto,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.usersService.reaffecter(
      requireUser(req),
      id,
      dto,
      locale,
    );
    return successResponse(translate(locale, "userReassigned"), data, locale);
  }

  @Post(":id/suspendre")
  @HttpCode(HttpStatus.OK)
  @ApiSuspendreUser()
  async suspendre(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: MotifRhDto = {},
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.usersService.suspendre(
      requireUser(req),
      id,
      dto,
      locale,
    );
    return successResponse(translate(locale, "userSuspended"), data, locale);
  }

  @Post(":id/reactiver")
  @HttpCode(HttpStatus.OK)
  @ApiReactiverUser()
  async reactiver(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.usersService.reactiver(
      requireUser(req),
      id,
      locale,
    );
    return successResponse(translate(locale, "userRestored"), data, locale);
  }

  @Post(":id/renvoyer")
  @HttpCode(HttpStatus.OK)
  @ApiRenvoyerUser()
  async renvoyer(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: MotifRhDto = {},
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.usersService.renvoyer(
      requireUser(req),
      id,
      dto,
      locale,
    );
    return successResponse(translate(locale, "userFired"), data, locale);
  }
}
