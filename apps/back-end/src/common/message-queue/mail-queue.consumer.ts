import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as nodemailer from "nodemailer"
import { forgetPassword, verification } from './mail.templates';

@Processor('email-queue')
export class MailConsumer extends WorkerHost {
    private transporter: nodemailer.Transporter;
    constructor() {
        super();
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.ZOHO_EMAIL,
                pass: process.env.ZOHO_PASSWORD,
            },
        });
    }

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
        email: string;
    }): Promise<void> {
        const mailOptions = {
            from: process.env.ZOHO_EMAIL,
            to: data.email,
            subject: 'Password Reset OTP',
            html: forgetPassword({ otp: data.otp }),
        }

        await this.transporter.sendMail(mailOptions);
    }

    private async handleVerificationOtp(data: {
        otp: string;
        email: string;
    }): Promise<void> {
        const mailOptions = {
            from: process.env.ZOHO_EMAIL,
            to: data.email,
            subject: 'Verification OTP',
            html: verification({ otp: data.otp }),
        }

        await this.transporter.sendMail(mailOptions);
    }
}