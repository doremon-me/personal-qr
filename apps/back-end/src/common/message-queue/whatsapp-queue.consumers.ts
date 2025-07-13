import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { forgetPassword, verification } from './whatsapp.templates';

@Processor('whatsapp-queue')
export class WhatsappConsumer extends WorkerHost {
    async process(job: Job): Promise<any> {
        switch (job.name) {
            case 'send-forget-password-otp':
                await this.handleForgetPasswordOtp(job.data);
                break;
            case 'send-verification-otp':
                await this.handleVerificationOtp(job.data);
                break;
            default:
                console.warn(`⚠️ Unhandled job: ${job.name}`);
                break;
        }
    }

    private async handleForgetPasswordOtp(data: {
        otp: string;
        number: string;
    }): Promise<void> {
        await fetch(`${process.env.WHATSAPP_API}/api/sendText`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-api-key": process.env.WHATSAPP_API_KEY
            },
            body: JSON.stringify({
                session: "default",
                chatId: `91${data.number}`,
                text: forgetPassword({ otp: data.otp }),
            })
        });
    }

    private async handleVerificationOtp(data: {
        otp: string;
        number: string;
    }): Promise<void> {
        await fetch(`${process.env.WHATSAPP_API}/api/sendText`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-api-key": process.env.WHATSAPP_API_KEY
            },
            body: JSON.stringify({
                session: "default",
                chatId: `91${data.number}`,
                text: verification({ otp: data.otp }),
            })
        });
    }
}