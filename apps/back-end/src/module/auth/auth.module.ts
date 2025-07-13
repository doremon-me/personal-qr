import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminModule } from '@module/admin/admin.module';
import { TokenModule } from '@common/token/token.module';
import { UserModule } from '@module/user/user.module';
import { MessageQueueModule } from '@common/message-queue/message-queue.module';
import { OtpModule } from '@module/otp/otp.module';

@Module({
  imports: [AdminModule, UserModule, TokenModule, MessageQueueModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
