import { ValidatorConstraintInterface, ValidationArguments } from "class-validator";
export declare class AdminEmailHasRecipientsConstraint implements ValidatorConstraintInterface {
    validate(_value: unknown, args: ValidationArguments): boolean;
    defaultMessage(): string;
}
