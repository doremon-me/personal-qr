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
            VERIFIED_JWT_SECRET: string;
            PASSWORD_RESET_JWT_SECRET: string;

            BULLMQ_REDIS_HOST: string;
            BULLMQ_REDIS_PORT: number;
            BULLMQ_REDIS_USER: string;
            BULLMQ_REDIS_PASS: string;

            WHATSAPP_API: string;
            WHATSAPP_API_KEY: string;

            ZOHO_EMAIL: string;
            ZOHO_PASSWORD: string;
        }
    }

    interface GraphQLContext {
        req: Request & { auth: AuthPayload }
        res: Response
    }
}

export { };