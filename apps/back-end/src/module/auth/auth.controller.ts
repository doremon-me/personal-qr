import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AdminSigninDto, UserSigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { TokenService } from '@common/token/token.service';
import { UserSignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly tokenService: TokenService) { }

    @Post('admin/signin')
    @HttpCode(HttpStatus.OK)
    async adminSignIn(@Body() adminSigninDto: AdminSigninDto, @Res() res: Response) {
        const admin = await this.authService.adminSignin(adminSigninDto);
        const token = await this.tokenService.adminAccess(admin);
        res.cookie('__admin_access', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        }).send();
    }

    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() userSignupDto: UserSignupDto, @Res() res: Response) {
        const user = await this.authService.userSignup(userSignupDto);
        const token = await this.tokenService.userAccess(user);
        res.cookie('__user_access', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        }).send();
    }

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    async signin(@Body() userSigninDto: UserSigninDto, @Res() res: Response) {
        const user = await this.authService.userSignin(userSigninDto);
        const token = await this.tokenService.userAccess(user);
        res.cookie('__user_access', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        }).send();
    }

    @Get("verify")
    @HttpCode(HttpStatus.OK)
    async verify(@Req() req: Request) {
        return req.auth;
    }

    @Post("forgetPassword")
    async forgetPassword(@Body() body: any) { }
}
