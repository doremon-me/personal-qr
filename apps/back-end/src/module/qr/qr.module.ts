import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { PrismaModule } from '@common/prisma/prisma.module';
import { MessageQueueModule } from '@common/message-queue/message-queue.module';
import { OtpModule } from '@module/otp/otp.module';

@Module({
  imports: [PrismaModule, MessageQueueModule, OtpModule],
  controllers: [QrController],
  providers: [QrService]
})
export class QrModule { }
