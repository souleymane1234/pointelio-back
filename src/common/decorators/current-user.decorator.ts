import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthUser } from "../types/request-context";

/** Utilisateur connecté (`req.user`) ou l'un de ses champs : `@CurrentUser("id")`. */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    return data ? request.user[data] : request.user;
  },
);
