import { BadRequestException, Injectable } from '@nestjs/common';
import { GenerateOtpDto } from './dto/generateOtp.dto';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class OtpService {
    constructor(private readonly prismaService: PrismaService) { }
    async generateOtp(generateOtpDto: GenerateOtpDto) {
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10);
        const existingOtp = await this.prismaService.otp.findFirst({
            where: {
                AND: [
                    { userId: generateOtpDto.userId },
                    { type: generateOtpDto.type },
                    { expiry: { gte: new Date() } }
                ]
            }
        });

        if (existingOtp) {
            return existingOtp;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return await this.prismaService.otp.create({
            data: {
                userId: generateOtpDto.userId,
                otp,
                expiry,
                type: generateOtpDto.type
            }
        });
    }

    async verifyOtp(otp: string, userId: string, type: string) {
        const existingOtp = await this.prismaService.otp.findFirst({
            where: {
                AND: [
                    { userId },
                    { type },
                    { otp },
                    { expiry: { gte: new Date() } }
                ]
            }
        });

        if (!existingOtp) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        await this.prismaService.otp.delete({
            where: { id: existingOtp.id }
        });

        return true;
    }
}
