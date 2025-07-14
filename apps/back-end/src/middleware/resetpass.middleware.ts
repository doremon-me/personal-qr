import { TokenService } from "@common/token/token.service";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class ResetPassMiddleware implements NestMiddleware {
    constructor(private readonly tokenService: TokenService) { }
    async use(req: Request, _res: Response, next: NextFunction) {
        const resetPassHeader = req.headers.authorization;
        const resetPassCookieToken = req.cookies?.__password_reset;
        const resetPassHeaderToken = resetPassHeader && resetPassHeader.startsWith('Authorization_Password_Reset ') ? resetPassHeader.split(' ')[1] : null;
        const resetPassToken: string = resetPassCookieToken || resetPassHeaderToken;

        if (resetPassToken) {
            try {
                const decoded = await this.tokenService.passwordResetAccess(resetPassToken);
                req.passReset = decoded;
                next();
            } catch (error) {
                req.passReset = null;
            }
        }

        next();
    }
}