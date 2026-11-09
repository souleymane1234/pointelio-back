import { Transform } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from "class-validator";
import { AdminEmailHasRecipientsConstraint } from "../validators/admin-email-recipients.constraint";

function normalizeIdList(value: unknown): number[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    return value.map((item) => Number(item));
  }
  return undefined;
}

function normalizeEmailList(value: unknown): string[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string" ? item.trim().toLowerCase() : "",
      )
      .filter(Boolean);
  }
  if (typeof value === "string") {
    const parts = value
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    return parts.length > 0 ? parts : undefined;
  }
  return undefined;
}

export class AdminSendEmailDto {
  @Transform(({ value }) => normalizeIdList(value))
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  userIds?: number[];

  @Transform(({ value }) => normalizeEmailList(value))
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];

  @Validate(AdminEmailHasRecipientsConstraint)
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @Transform(({ value }) => normalizeEmailList(value))
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];

  @IsOptional()
  @Transform(({ value }) => normalizeEmailList(value))
  @IsArray()
  @IsEmail({}, { each: true })
  bcc?: string[];

  @IsOptional()
  @IsEmail()
  replyTo?: string;

  @IsOptional()
  @IsEmail()
  fromEmail?: string;

  @IsOptional()
  @IsString()
  fromName?: string;

  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;
}
