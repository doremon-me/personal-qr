import { Body, Controller, Post, Res } from '@nestjs/common';
import { AdminSigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { TokenService } from '@common/token/token.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly tokenService: TokenService) { }

    @Post('admin/signin')
    async adminSignIn(@Body() adminSigninDto: AdminSigninDto, @Res() res: Response) {
        const admin = await this.authService.adminSignin(adminSigninDto);
        const token = await this.tokenService.adminAccess(admin);
        res.cookie('__admin_access', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        }).send();
    }
}
