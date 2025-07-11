import { PickType } from "@nestjs/mapped-types";
import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { AdminDto } from "./admin.dto";

@ValidatorConstraint({ name: "OnlyOneField", async: false })
class OnlyOneFieldConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        const fields = ["id", "number"];
        const presentFields = fields.filter((field) => value[field] !== undefined && value[field] !== null);
        return presentFields.length === 1;
    }

    defaultMessage(): string {
        return "Only 'id' or 'number' must be provided.";
    }
}

export class FindOneDto extends PickType(AdminDto, ["id", "number",] as const) {
    @Validate(OnlyOneFieldConstraint, {
        message: "Only 'id' or 'number' must be provided."
    })
    validateFields: any;
}