import { PickType } from "@nestjs/mapped-types";
import { OtpDto } from "./otp.dto";

export class GenerateOtpDto extends PickType(OtpDto, ['userId', 'type'] as const) {}