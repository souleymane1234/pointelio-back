import { ApiProperty } from "@nestjs/swagger";

/** Meta pagination partagée (`PaginatedResponse.pagination`). */
export class PaginationMetaSchemaDto {
  @ApiProperty({ type: Number, example: 1 })
  current_page: number;

  @ApiProperty({ type: Number, example: 3 })
  total_pages: number;

  @ApiProperty({ type: Number, example: 10 })
  per_page: number;

  @ApiProperty({ type: Number, example: 25 })
  total_items: number;
}
