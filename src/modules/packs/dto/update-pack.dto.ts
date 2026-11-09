import { PartialType } from "@nestjs/swagger";
import { CreatePackDto } from "./create-pack.dto";

/** Mise à jour partielle d'un pack. Au moins un champ requis. */
export class UpdatePackDto extends PartialType(CreatePackDto) {}
