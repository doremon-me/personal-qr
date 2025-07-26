import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailConsumer } from './mail-queue.consumer';
import { SmsConsumer } from './sms-queue.consumer';

@Module({
    imports: [
        BullModule.registerQueue({
            name: "email-queue",
        }),
        BullModule.registerQueue({
            name: "sms-queue",
        }),
    ],
    exports: [BullModule],
    providers: [MailConsumer, SmsConsumer]
})
export class MessageQueueModule { }
