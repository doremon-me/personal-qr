import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PasswordResetPayload } from '@common/token/token.service';
import { Request } from 'express';

export const PasswordReset = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        return request.passReset as PasswordResetPayload;
    },
);