import { TokenService } from "@common/token/token.service";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class VerifyMiddleware implements NestMiddleware {
    constructor(private readonly tokenService: TokenService) { }
    async use(req: Request, _res: Response, next: NextFunction) {

        const verifiedHeader = req.headers.authorization;
        const verifiedCookieToken = req.cookies?.__verified;
        const verifiedHeaderToken = verifiedHeader && verifiedHeader.startsWith('Verified_User ') ? verifiedHeader.split(' ')[1] : null;
        const verifiedToken: string = verifiedCookieToken || verifiedHeaderToken;

        if (verifiedToken) {
            try {
                const decoded = await this.tokenService.verifiedAccess(verifiedToken);
                req.verified = decoded;
            } catch (error) {
                req.verified = null;
            }
        }

        next();
    }
}