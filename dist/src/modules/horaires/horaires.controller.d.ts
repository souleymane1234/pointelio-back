import { type AuthedRequest } from "../../common/types/request-context";
import { CreateHoraireDto, UpdateHoraireDto } from "./dto/horaire.dto";
import { HorairesService } from "./horaires.service";
export declare class HorairesController {
    private readonly horaires;
    constructor(horaires: HorairesService);
    findAll(req: AuthedRequest): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        joursTravail: number[];
        utilisateursCount: number;
        id: number;
        entrepriseId: number;
        nom: string;
        createdAt: Date;
        toleranceMin: number;
        heureDebut: string;
        heureFin: string;
    }[]>>;
    findOne(req: AuthedRequest, id: number): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        joursTravail: number[];
        utilisateursCount: number;
        id: number;
        entrepriseId: number;
        nom: string;
        createdAt: Date;
        toleranceMin: number;
        heureDebut: string;
        heureFin: string;
    }>>;
    create(req: AuthedRequest, dto: CreateHoraireDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        joursTravail: number[];
        utilisateursCount: number;
        id: number;
        entrepriseId: number;
        nom: string;
        createdAt: Date;
        toleranceMin: number;
        heureDebut: string;
        heureFin: string;
    }>>;
    update(req: AuthedRequest, id: number, dto: UpdateHoraireDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        joursTravail: number[];
        utilisateursCount: number;
        id: number;
        entrepriseId: number;
        nom: string;
        createdAt: Date;
        toleranceMin: number;
        heureDebut: string;
        heureFin: string;
    }>>;
    remove(req: AuthedRequest, id: number): Promise<import("../../common/interfaces/response.interface").SuccessResponse<undefined>>;
    private locale;
}
