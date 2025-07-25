import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '@common/prisma/prisma.module';
import { UserController } from './user.controller';
import { MessageQueueModule } from '@common/message-queue/message-queue.module';

@Module({
  imports: [PrismaModule, MessageQueueModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule { }
