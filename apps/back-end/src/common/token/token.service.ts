import { Admin, User } from '@generated/prisma';
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type AuthPayload = {
    id: string;
}

export type VerifiedPayload = {
    id: string;
    isEmailVerified?: boolean;
    isNumberVerified?: boolean;
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
            if (typeof userOrToken === 'string') {
                throw new UnauthorizedException('Invalid or expired token');
            } else {
                throw new InternalServerErrorException('Failed to generate user token');
            }
        }
    }

    async verifiedAccess(token: string): Promise<VerifiedPayload>;
    async verifiedAccess(user: User): Promise<string>;
    async verifiedAccess(userOrToken: User | string): Promise<string | VerifiedPayload> {
        try {
            if (typeof userOrToken === "string") {
                return await this.jwtService.verifyAsync(userOrToken, {
                    secret: process.env.VERIFIED_JWT_SECRET
                }) as VerifiedPayload;
            } else {
                const payload: VerifiedPayload = {
                    id: userOrToken.id,
                    isEmailVerified: userOrToken.isEmailVerified,
                    isNumberVerified: userOrToken.isNumberVerified
                };
                return await this.jwtService.signAsync(payload, {
                    secret: process.env.VERIFIED_JWT_SECRET
                });
            }
        } catch (error) {
            if (typeof userOrToken === 'string') {
                throw new UnauthorizedException('Invalid or expired token');
            } else {
                throw new InternalServerErrorException('Failed to generate verified token');
            }
        }
    }
}
