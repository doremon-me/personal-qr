import { BadRequestException, Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { IdDto, ScanQrDto } from './dto/scanqr.dto';
import { QrService } from './qr.service';
import { VerifyOtpDto } from './dto/verify.dto';
import { Request, Response } from 'express';

@Controller('qr')
export class QrController {
    constructor(private readonly qrService: QrService) { }
    @Post("scan")
    async scanQr(@Body() scanQrDto: ScanQrDto, @Query() queryParams: IdDto, @Res() res: Response) {
        const profile = await this.qrService.scanQr(scanQrDto, queryParams.id);
        res.cookie('profile', profile.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.send();
    }

    @Post("verify")
    async verify(@Body() verifyDto: VerifyOtpDto, @Req() req: Request) {
        const profileId: string | undefined = req.cookies.profile;
        if (!profileId) throw new BadRequestException("Bad request");
        return await this.qrService.verify(verifyDto, profileId);
    }
}
