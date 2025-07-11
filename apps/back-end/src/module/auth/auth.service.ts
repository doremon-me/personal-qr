import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AdminSigninDto, UserSigninDto } from './dto/signin.dto';
import { AdminService } from '@module/admin/admin.service';
import { comparePassword } from '@common/utils/hash.util';
import { UserService } from '@module/user/user.service';
import { UserSignupDto } from './dto/signup.dto';
import { Admin, User } from '@generated/prisma';

@Injectable()
export class AuthService {
    constructor(private readonly adminService: AdminService, private readonly userService: UserService) { }
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
}
