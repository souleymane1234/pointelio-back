import { AuthResponse } from "../interfaces/auth-response.interface";
export declare function authTokensSnakeCase(tokens: {
    accessToken: string;
    refreshToken: string;
}): {
    access_token: string;
    refresh_token: string;
};
export declare function authSuccessData(result: AuthResponse): {
    user: {
        telephone: string | null;
        email: string | null;
        id: number;
        entrepriseId: number | null;
        siteId: number | null;
        matricule: string | null;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        poste: string | null;
        photoUrl: string | null;
    };
    access_token: string;
    refresh_token: string;
};
