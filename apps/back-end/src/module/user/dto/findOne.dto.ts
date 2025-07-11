import { PickType } from "@nestjs/mapped-types";
import { UserDto } from "./user.dto";
import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "OnlyOneField", async: false })
class OnlyOneFieldConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        const fields = ["id", "number", "email"];
        const presentFields = fields.filter((field) => value[field] !== undefined && value[field] !== null);
        return presentFields.length === 1;
    }

    defaultMessage(): string {
        return "Only one of 'id', 'number', or 'email' must be provided.";
    }
}

export class FindOneDto extends PickType(UserDto, ["id", "number", "email"] as const) {
    @Validate(OnlyOneFieldConstraint, {
        message: "Only one of 'id', 'number', or 'email' must be provided."
    })
    validateFields: any;
}