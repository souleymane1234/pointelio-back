import { AuthResponse } from "../interfaces/auth-response.interface";

/** Champs tokens au format snake_case (spec doc mobile). */
export function authTokensSnakeCase(tokens: {
  accessToken: string;
  refreshToken: string;
}): { access_token: string; refresh_token: string } {
  return {
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  };
}

export function authSuccessData(result: AuthResponse) {
  return {
    ...authTokensSnakeCase(result),
    user: result.user,
  };
}
