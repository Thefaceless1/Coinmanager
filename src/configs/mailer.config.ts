import 'dotenv/config'
import {MailerOptions} from "@nestjs-modules/mailer";

export const mailerConfig: MailerOptions = {
    transport: {
        host: process.env.MAILER_HOST,
        port: Number(process.env.MAILER_PORT),
        secure: true,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS
        }
    }
}