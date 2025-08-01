import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AdminSigninDto, UserSigninDto } from './dto/signin.dto';
import { AdminService } from '@module/admin/admin.service';
import { comparePassword } from '@common/utils/hash.util';
import { UserService } from '@module/user/user.service';
import { UserSignupDto } from './dto/signup.dto';
import { Admin, User } from '@generated/prisma';
import { ForgetPassDto } from './dto/forgetpass.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OtpService } from '@module/otp/otp.service';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { AuthPayload, PasswordResetPayload } from '@common/token/token.service';
import { ResetPassDto } from './dto/resetpass.dto';

@Injectable()
export class AuthService {
    constructor(private readonly adminService: AdminService, private readonly userService: UserService, @InjectQueue("email-queue") private emailQueue: Queue, @InjectQueue('sms-queue') private smsQueue: Queue, private readonly otpService: OtpService) { }
    async adminSignin(adminSigninDto: AdminSigninDto) {
        const admin = await this.adminService.findOne({ number: adminSigninDto.number, id: "", validateFields: { id: false, number: true } });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        const isPasswordValid = await comparePassword(adminSigninDto.password, admin.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return admin;
    }

    async userSignup(userSignupDto: UserSignupDto) {
        const findOneDto = {
            id: "",
            email: userSignupDto.email,
            number: userSignupDto.number,
            validateFields: {
                id: false,
                email: true,
                number: true
            }
        }
        const existingUser = await this.userService.findOne(findOneDto);
        if (existingUser) {
            throw new UnauthorizedException('User already exists');
        }

        const user = await this.userService.createUser(userSignupDto);
        const otp = await this.otpService.generateOtp({ type: "verification", userId: user.id });

        if (userSignupDto.number) {
            await this.smsQueue.add('send-verification-otp', {
                type: otp.type,
                userId: user.id,
                otp: otp.otp,
                number: user.number
            });
        }
        if (userSignupDto.email) {
            await this.emailQueue.add('send-verification-otp', {
                type: otp.type,
                userId: user.id,
                otp: otp.otp,
                email: user.email
            });
        }
        return user;
    }

    async userSignin(userSigninDto: UserSigninDto) {
        const findOneDto = {
            id: "",
            email: userSigninDto.email,
            number: userSigninDto.number,
            validateFields: {
                id: false,
                email: true,
                number: true
            }
        }
        const user = await this.userService.findOne(findOneDto);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await comparePassword(userSigninDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        if (userSigninDto.email && !user.isEmailVerified) {
            const otp = await this.otpService.generateOtp({ type: "verification", userId: user.id });
            if (userSigninDto.email) {
                await this.emailQueue.add('send-verification-otp', {
                    type: otp.type,
                    userId: user.id,
                    otp: otp.otp,
                    email: user.email
                });
            }
        }

        if (userSigninDto.number && !user.isNumberVerified) {
            const otp = await this.otpService.generateOtp({ type: "verification", userId: user.id });
            if (userSigninDto.number) {
                await this.smsQueue.add('send-verification-otp', {
                    type: otp.type,
                    userId: user.id,
                    otp: otp.otp,
                    number: user.number
                });
            }
        }

        return user;
    }

    async verify(id: string, verify: "user"): Promise<User>;
    async verify(id: string, verify: "admin"): Promise<Admin>;
    async verify(id: string, verify: "user" | "admin"): Promise<User | Admin> {
        if (verify === 'user') {
            const user = await this.userService.findOne({ id, email: "", number: "", validateFields: { id: true, number: false, email: false } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } else {
            const admin = await this.adminService.findOne({ number: "", id: id, validateFields: { id: true, number: false } });
            if (!admin) {
                throw new NotFoundException('Admin not found');
            }
            return admin;
        }
    }

    async forgetPass(forgetPassDto: ForgetPassDto) {
        const user = await this.userService.findOne({
            id: "",
            email: forgetPassDto.email,
            number: forgetPassDto.number,
            validateFields: {
                id: false,
                email: true,
                number: true
            }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const otp = await this.otpService.generateOtp({ type: "forget-password", userId: user.id });
        if (forgetPassDto.number) {
            await this.smsQueue.add('send-forget-password-otp', {
                type: otp.type,
                userId: user.id,
                otp: otp.otp,
                number: user.number
            });
        }
        if (forgetPassDto.email) {
            await this.emailQueue.add('send-forget-password-otp', {
                type: otp.type,
                userId: user.id,
                otp: otp.otp,
                email: user.email
            });
        }
        return user;
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto, userAuth: AuthPayload) {
        const verification = await this.otpService.verifyOtp(verifyOtpDto.otp, userAuth.id, verifyOtpDto.type);
        if (!verification) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }
        return await this.userService.updateUser(userAuth.id, verifyOtpDto.email ? { isEmailVerified: true } : { isNumberVerified: true });
    }

    async resetPassword(resetPassDto: ResetPassDto, resetPassword: PasswordResetPayload) {
        return await this.userService.updateUser(resetPassword.id, {
            password: resetPassDto.password,
        });
    }
}
