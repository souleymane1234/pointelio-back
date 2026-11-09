import type { AuthUserRow } from "../services/login.select";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserRow;
}
