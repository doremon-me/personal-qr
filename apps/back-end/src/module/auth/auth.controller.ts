import { Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AdminSigninDto, UserSigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthPayload, TokenService, PasswordResetPayload } from '@common/token/token.service';
import { UserSignupDto } from './dto/signup.dto';
import { plainToInstance } from 'class-transformer';
import { AuthSerializer } from './auth.serilizer';
import { ForgetPassDto } from './dto/forgetpass.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { UserAuth } from '@common/decorators/userAuth.decorator';
import { ResetPassDto } from './dto/resetpass.dto';
import { PasswordReset } from '@common/decorators/resetPass.decorator';

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
        });

        res.json(plainToInstance(AuthSerializer, admin, {
            excludeExtraneousValues: true,
        }));
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
        });

        res.json(plainToInstance(AuthSerializer, user, {
            excludeExtraneousValues: true,
        }));
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
        });

        if (userSigninDto.email && user.isEmailVerified) {
            const verifiedAccess = await this.tokenService.verifiedAccess(user);
            res.cookie("__verified", verifiedAccess, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            });
        }

        if (userSigninDto.number && user.isNumberVerified) {
            const verifiedAccess = await this.tokenService.verifiedAccess(user);
            res.cookie("__verified", verifiedAccess, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            });
        }

        res.json(plainToInstance(AuthSerializer, user, {
            excludeExtraneousValues: true,
        }));
    }

    @Get("verify")
    @HttpCode(HttpStatus.OK)
    async verify(@Req() req: Request, @Res() res: Response) {
        if (!req.userAuth && !req.adminAuth) {
            throw new UnauthorizedException("Unauthorized access");
        }
        if (req.userAuth) {
            const user = await this.authService.verify(req.userAuth.id, "user");
            const token = await this.tokenService.userAccess(user);
            res.cookie('__user_access', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.json(plainToInstance(AuthSerializer, user, {
                excludeExtraneousValues: true,
            }));
            return;
        }
        if (req.adminAuth) {
            const admin = await this.authService.verify(req.adminAuth.id, "admin");
            const token = await this.tokenService.adminAccess(admin);

            res.cookie('__admin_access', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.json(plainToInstance(AuthSerializer, admin, {
                excludeExtraneousValues: true,
            }));
            return;
        }

    }

    @Post("forgetPassword")
    async forgetPassword(@Body() body: ForgetPassDto, @Res() res: Response) {
        const user = await this.authService.forgetPass(body);
        const token = await this.tokenService.userAccess(user);
        res.cookie('__user_access', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json(plainToInstance(AuthSerializer, user, {
            excludeExtraneousValues: true,
        }));
    }

    @Post("verifyOtp")
    async verifyOtp(@Body() body: VerifyOtpDto, @UserAuth() userAuth: AuthPayload, @Res() res: Response) {
        if (!userAuth) {
            throw new UnauthorizedException("Unauthorized access");
        }
        const user = await this.authService.verifyOtp(body, userAuth);
        const token = await this.tokenService.userAccess(user);
        res.cookie('__user_access', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        const verifiedAccess = await this.tokenService.verifiedAccess(user);
        res.cookie("__verified", verifiedAccess, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        if (body.type === "forget-password") {
            const token = await this.tokenService.passwordResetAccess(user);
            res.cookie('__password_reset', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 10 * 60 * 1000,
            });
        }

        res.json(plainToInstance(AuthSerializer, user, {
            excludeExtraneousValues: true,
        }));
    }

    @Post("resetPassword")
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Res() res: Response, @Body() resetPassDto: ResetPassDto, @PasswordReset() passwordReset: PasswordResetPayload) {
        if (!passwordReset) {
            throw new UnauthorizedException("Unauthorized access");
        }
        const user = await this.authService.resetPassword(resetPassDto, passwordReset);
        if (!user) {
            throw new InternalServerErrorException("Failed to reset password");
        }
        const token = await this.tokenService.userAccess(user);
        res.cookie('__user_access', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.clearCookie("__password_reset");
        res.json(plainToInstance(AuthSerializer, user, {
            excludeExtraneousValues: true,
        }));
    }
}
