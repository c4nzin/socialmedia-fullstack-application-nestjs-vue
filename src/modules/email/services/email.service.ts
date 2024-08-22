import { Process, Processor } from '@nestjs/bull';
import { RegisteredUserJob } from '../types/registered-user.job';
import { MailerService } from '@nestjs-modules/mailer';

export const EMAIL_QUEUE = 'email-queue';
export const USER_REGISTERED = 'user-registered';

@Processor(EMAIL_QUEUE)
export class EmailService {
  constructor(private readonly emailService: MailerService) {}

  //TODO : ADD REVERIFY ACCOUNT
  //TODO : ADD FORGOT PASSWORD

  @Process(USER_REGISTERED)
  public async userRegistered(job: RegisteredUserJob): Promise<void> {
    const subject = `Welcome to nexus app! dear, ${job.data.username}`;

    await this.emailService.sendMail({
      to: job.data.email,
      subject,
      html: `<div> 
        <h4>nexus app!</h4>
        Otp Code : ${job.data.otp}
      </div>`,
    });
  }
}
