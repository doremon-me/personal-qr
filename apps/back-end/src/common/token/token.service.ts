import { Admin } from '@generated/prisma';
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
                return await this.jwtService.verifyAsync(adminOrToken) as AuthPayload;
            }
            else {
                const payload: AuthPayload = { id: adminOrToken.id };
                return await this.jwtService.signAsync(payload, {
                    secret: process.env.JWT_SECRET
                });
            }
        } catch (error) {
            console.error('Token generation error:', error);
            if (typeof adminOrToken === 'string') {
                throw new UnauthorizedException('Invalid or expired token');
            } else {
                throw new InternalServerErrorException('Failed to generate admin token');
            }
        }
    }
}
