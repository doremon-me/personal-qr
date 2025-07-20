import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { VerifiedPayload } from '@common/token/token.service';
import { Request } from 'express';

export const VerifiedInfo = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        return request.verified as VerifiedPayload;
    },
);