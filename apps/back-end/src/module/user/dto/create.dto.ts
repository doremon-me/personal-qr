import { PickType } from "@nestjs/mapped-types";
import { UserDto } from "./user.dto";

export class CreateUserDto extends PickType(UserDto, ["name", "number", "email", "password"]) { }