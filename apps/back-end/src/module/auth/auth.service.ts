import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AdminSigninDto, UserSigninDto } from './dto/signin.dto';
import { AdminService } from '@module/admin/admin.service';
import { comparePassword } from '@common/utils/hash.util';
import { UserService } from '@module/user/user.service';
import { UserSignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(private readonly adminService: AdminService, private readonly userService: UserService) { }
    async adminSignin(adminSigninDto: AdminSigninDto) {
        const admin = await this.adminService.findAdmin(adminSigninDto.number);
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
        const user = await this.userService.findOne(findOneDto);
        if (user) {
            throw new UnauthorizedException('User already exists');
        }
        return await this.userService.createUser(userSignupDto);
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

        return user;
    }
}
