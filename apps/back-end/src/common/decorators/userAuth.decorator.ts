import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPayload } from '@common/token/token.service';
import { Request } from 'express';

export const UserAuth = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        return request.userAuth as AuthPayload;
    },
);