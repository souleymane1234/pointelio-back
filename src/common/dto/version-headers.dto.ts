import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO pour les headers de vérification de version mobile
 */
export class VersionHeadersDto {
  @ApiProperty({
    name: "app-mobile-platform",
    description:
      "Mobile only: ios | android. Absent or web → pas de vérif (site client).",
    example: "ios",
    required: false,
  })
  "app-mobile-platform"?: string;

  @ApiProperty({
    name: "app-mobile-version",
    description: "Version format: x.x.x",
    example: "1.0.0",
    required: false,
  })
  "app-mobile-version"?: string;

  @ApiProperty({
    name: "bypass-update-key",
    description:
      "Clé secrète (VERSION_CHECK_BYPASS_KEY) pour contourner toute la vérification de version.",
    example: "dev-version-bypass",
    required: false,
  })
  "bypass-update-key"?: string;
}
