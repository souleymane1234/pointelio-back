import { Injectable } from "@nestjs/common";
import type { AuthUser } from "../../common/types/request-context";
import type { AnomaliesQueryDto } from "./dto/pointage.dto";
import { PointagesService } from "./pointages.service";

/** Retard, oubli de départ, hors zone / à vérifier — s'appuie sur les pointages. */
@Injectable()
export class AnomaliesService {
  constructor(private readonly pointages: PointagesService) {}

  list(user: AuthUser, entrepriseId: number, query: AnomaliesQueryDto) {
    return this.pointages.findAnomalies(user, entrepriseId, query);
  }
}
