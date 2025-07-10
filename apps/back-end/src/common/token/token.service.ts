import { Admin, User } from '@generated/prisma';
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type AuthPayload = {
    id: string;
}

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) { }
    adminAccess(admin: Admin): Promise<string>;
    adminAccess(token: string): Promise<AuthPayload>;

    async adminAccess(adminOrToken: Admin | string): Promise<string | AuthPayload> {
        try {
            if (typeof adminOrToken === "string") {
                return await this.jwtService.verifyAsync(adminOrToken, {
                    secret: process.env.ADMIN_JWT_SECRET
                }) as AuthPayload;
            }
            else {
                const payload: AuthPayload = { id: adminOrToken.id };
                return await this.jwtService.signAsync(payload, {
                    secret: process.env.ADMIN_JWT_SECRET
                });
            }
        } catch (error) {
            if (typeof adminOrToken === 'string') {
                throw new UnauthorizedException('Invalid or expired token');
            } else {
                throw new InternalServerErrorException('Failed to generate admin token');
            }
        }
    }

    userAccess(user: User): Promise<string>;
    userAccess(token: string): Promise<AuthPayload>;

    async userAccess(userOrToken: User | string): Promise<string | AuthPayload> {
        try {
            if (typeof userOrToken === "string") {
                return await this.jwtService.verifyAsync(userOrToken, {
                    secret: process.env.USER_JWT_SECRET
                }) as AuthPayload;
            }
            else {
                const payload: AuthPayload = { id: userOrToken.id };
                return await this.jwtService.signAsync(payload, {
                    secret: process.env.USER_JWT_SECRET
                });
            }
        } catch (error) {
            console.log(error);
            if (typeof userOrToken === 'string') {
                throw new UnauthorizedException('Invalid or expired token');
            } else {
                throw new InternalServerErrorException('Failed to generate user token');
            }
        }
    }
}
