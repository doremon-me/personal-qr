import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { WhatsappConsumer } from './whatsapp-queue.consumers';
import { MailConsumer } from './mail-queue.consumer';

@Module({
    imports: [
        BullModule.registerQueue({
            name: "whatsapp-queue",
        }),
        BullModule.registerQueue({
            name: "email-queue",
        })
    ],
    exports: [BullModule],
    providers: [WhatsappConsumer, MailConsumer]
})
export class MessageQueueModule { }
