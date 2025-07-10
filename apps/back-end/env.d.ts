import { AuthPayload } from "@common/token/token.service";
import { Request, Response } from "express";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT: number;
            DATABASE_URL: string;

            ADMIN_JWT_SECRET: string;
            USER_JWT_SECRET: string;
        }
    }

    interface GraphQLContext {
        req: Request & { auth: AuthPayload }
        res: Response
    }
}

export { };