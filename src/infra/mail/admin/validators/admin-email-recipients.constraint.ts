import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "adminEmailHasRecipients", async: false })
export class AdminEmailHasRecipientsConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as { userIds?: number[]; emails?: string[] };
    const userCount = dto.userIds?.length ?? 0;
    const emailCount = dto.emails?.length ?? 0;
    return userCount + emailCount > 0;
  }

  defaultMessage(): string {
    return "Provide at least one recipient via userIds and/or emails.";
  }
}
