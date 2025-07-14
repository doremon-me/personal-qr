import { Request } from 'express';
import { AdminPayload, UserPayload } from './common/jwt/jwt.service';
import { AuthPayload, PasswordResetPayload } from '@common/token/token.service';


declare global {
    namespace Express {
        interface Request {
            userAuth: AuthPayload | null;
            adminAuth: AuthPayload | null;
            passReset: PasswordResetPayload | null;
        }
    }
}