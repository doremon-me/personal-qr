import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AdminSigninDto } from './dto/signin.dto';
import { AdminService } from '@module/admin/admin.service';
import { comparePassword } from '@common/utils/hash.util';

@Injectable()
export class AuthService {
    constructor(private readonly adminService: AdminService) { }
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
}
