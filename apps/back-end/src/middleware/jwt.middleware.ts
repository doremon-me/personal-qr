import { TokenService } from "@common/token/token.service";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly tokenService: TokenService) { }
    async use(req: Request, _res: Response, next: NextFunction) {

        const authHeader = req.headers.authorization;
        const userCookieToken = req.cookies?.__user_access;
        const userHeaderToken = authHeader && authHeader.startsWith('Authorization_User ') ? authHeader.split(' ')[1] : null;
        const userToken: string = userCookieToken || userHeaderToken;

        const adminCookieToken = req.cookies?.__admin_access;
        const adminHeaderToken = authHeader && authHeader.startsWith('Authorization_Admin ') ? authHeader.split(' ')[1] : null;
        const adminToken: string = adminCookieToken || adminHeaderToken;

        if (userToken) {
            try {
                const decoded = await this.tokenService.userAccess(userToken);
                req.userAuth = decoded;
            } catch (error) {
                req.userAuth = null;
            }
        }
        if (adminToken) {
            try {
                const decoded = await this.tokenService.adminAccess(adminToken);
                req.adminAuth = decoded;
            } catch (error) {
                req.adminAuth = null;
            }
        }

        next();
    }
}