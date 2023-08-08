import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";
import * as Process from "process";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {
    }

    public async sendMail(receiver: string): Promise<void> {
        try {
            await this.mailerService.sendMail({
                from: Process.env.MAILER_USER,
                to: receiver,
                subject: 'Restore password <Coinmanager>',
                html: '<b>Follow the link to set a new password: </b>',
            })
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
}