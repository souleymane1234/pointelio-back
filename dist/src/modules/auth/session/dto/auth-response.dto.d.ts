import { Role } from "@prisma/client";
declare class AuthUserSchemaDto {
    id: number;
    entrepriseId: number | null;
    siteId: number | null;
    matricule: string | null;
    nom: string;
    prenom: string;
    email: string | null;
    telephone: string | null;
    role: Role;
    poste: string | null;
    photoUrl: string | null;
}
export declare class AuthDataSchemaDto {
    access_token: string;
    refresh_token: string;
    user: AuthUserSchemaDto;
}
declare class AuthRefreshDataSchemaDto {
    access_token: string;
    refresh_token: string;
}
export declare class AuthRegisterLoginResponseSchemaDto {
    success: true;
    message: string;
    data: AuthDataSchemaDto;
}
export declare class AuthRefreshResponseSchemaDto {
    success: true;
    message: string;
    data: AuthRefreshDataSchemaDto;
}
export {};
