import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminModule } from '@module/admin/admin.module';
import { TokenService } from '@common/token/token.service';

@Module({
  imports: [AdminModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService]
})
export class AuthModule { }
