import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('sms-queue')
export class SmsConsumer extends WorkerHost {
    async process(job: Job) {
        await fetch(`${process.env.SMS_API_URL}`, {
            method: "POST",
            headers: {
                "authorization": process.env.OTP_SMS_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                route: "otp",
                variables_values: job.data.otp,
                numbers: job.data.number,
            })
        });
    }
}