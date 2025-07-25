import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ScanQrDto } from './dto/scanqr.dto';
import { PrismaService } from '@common/prisma/prisma.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { OtpService } from '@module/otp/otp.service';
import { VerifyOtpDto } from './dto/verify.dto';


@Injectable()
export class QrService {
    constructor(private readonly prismaService: PrismaService, @InjectQueue('sms-queue') private smsQueue: Queue, private readonly otpService: OtpService) { }
    async scanQr(scanQrDto: ScanQrDto, id: string) {
        const profile = await this.prismaService.profile.findUnique({
            where: {
                id
            },
            include: {
                Contacts: true
            }
        });
        if (!profile) throw new NotFoundException("Your details not found");

        const otp = await this.otpService.generateOtp({
            type: "verify",
            userId: profile.id
        });

        await this.smsQueue.add('send-verification-otp', {
            type: "verify",
            userId: profile.id,
            otp: otp.otp,
            number: scanQrDto.number
        });

        return profile;
    }

    async verify(verifyDto: VerifyOtpDto, profileId: string) {
        const otp = await this.otpService.verifyOtp(verifyDto.otp, profileId, "verify");
        if (!otp) {
            throw new UnauthorizedException("Invalid otp");
        }
        const contacts = await this.prismaService.profile.findUnique({
            where: {
                id: profileId
            },
            select: {
                Contacts: true
            }
        });
        if (!contacts)
            throw new BadRequestException("Invalid request");
        return contacts.Contacts;
    }
}
