import { EmailTemplateInterface } from "./../model/email-template";
import { BadRequestException } from "./../web/exception/bad-request-exception";
import { EmailTemplateRepoInterface } from "./../repo/email-template";
import { KafkaMQ } from "../infra/kafka";
import { render } from "ejs";
import { GetObjectOutput } from "@aws-sdk/client-s3";
import { EmailQueueRepoInterface } from "../repo/email-queue";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { ERROR_CODES } from "../constant/error";
import config from "../config/config";
import { EMAIL_QUEUE_STATUS } from "../constant/common";
import newAWSClient from "../infra/aws-client";
import { EmailQueueInterface } from "../model/email-queue";

export interface EmailSenderServiceInterface {
    consumeEmailBatch(): Promise<void>;
}

export class EmailSenderService implements EmailSenderServiceInterface {
    private kafkaMQ: KafkaMQ;
    private transporter: nodemailer.Transporter;
    private emailQueueRepo: EmailQueueRepoInterface;
    private emailTemplateRepo: EmailTemplateRepoInterface;

    constructor(kafkaMQ: KafkaMQ, emailQueueRepo: EmailQueueRepoInterface, emailTemplateRepo: EmailTemplateRepoInterface) {
        this.kafkaMQ = kafkaMQ;
        this.transporter = this.createTransporter();
        this.emailQueueRepo = emailQueueRepo;
        this.emailTemplateRepo = emailTemplateRepo;
    }

    public async consumeEmailBatch(): Promise<void> {

        this.kafkaMQ.consumeFromTopic("email-topic", async (message) => {
            try {
                const { users, emailTemplate } = JSON.parse(message.value as string);
                await this.sendEmails(users, emailTemplate);
            } catch (error) {
                console.error("Error processing email batch:", error);
            }
        });
    }

    private async sendEmails(users: any[], templateName: string): Promise<void> {
        const emailTemplate = await this.emailTemplateRepo.getByName(templateName);
		if (!emailTemplate) {
			throw new BadRequestException(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND);
		}

        const { templateOnS3 } = await this.getTemplateFromS3(templateName);
        const renderedHtml = await this.renderHtml(templateOnS3.toString(), { users });

        const responses = await Promise.allSettled(
            users.map(user => this.sendEmail(user.to, emailTemplate, renderedHtml))
        );

        responses.forEach(async (response, index) => {
            const user = users[index];
            
           const data: EmailQueueInterface = {
                from: config.EMAIL.sender.from,
                to: user.to,
                replyTo: emailTemplate.replyTo || "",
                cc: emailTemplate.cc || [],
                bcc: emailTemplate.bcc || [],
                subject: emailTemplate.subject,
                client: emailTemplate.client,
                service: emailTemplate.service,
                sender: emailTemplate.sender,
                message: response.status === "rejected" ? JSON.stringify(response.reason) : "",
                data: response.status === "rejected" ? JSON.stringify(user) : "",
                templateName: emailTemplate.templateName,
                status: EMAIL_QUEUE_STATUS.SENT,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            await this.emailQueueRepo.create(data);
        });
    }

    private async renderHtml(html: string, context: Record<string, unknown>): Promise<string> {
		return render(html, context);
	}

    private createTransporter(): Mail {
		return nodemailer.createTransport({
			name: config.EMAIL.name,
			host: config.EMAIL.host,
			port: config.EMAIL.port,
			secure: false,
			pool: true,
			auth: config.EMAIL.auth
		})
	}

    public async getTemplateFromS3(templateName: string): Promise<{ templateOnS3: GetObjectOutput }> {
		try {
			return { templateOnS3: await newAWSClient().getTemplateByName(`${ templateName }.html`) };
		} catch (err) {
            throw new BadRequestException(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND);
		}
	}

    private async sendEmail(to: string, emailTemplate: EmailTemplateInterface, renderHtml: string) {
        const response = await this.transporter.sendMail({
            from: `${ config.EMAIL.sender.name } <${ config.EMAIL.sender.from }>`,
            to,
            replyTo: emailTemplate.replyTo,
            cc: emailTemplate.cc,
            bcc: emailTemplate.bcc,
            subject: emailTemplate.subject,
            html: renderHtml,
            attachments: []
        });
        return response;
    }
}

export const newEmailSenderService = async (
    kafkaMQ: KafkaMQ,
    emailQueueRepo: EmailQueueRepoInterface,
    emailTemplateRepo: EmailTemplateRepoInterface
): Promise<EmailSenderService> => {
    return new EmailSenderService(kafkaMQ, emailQueueRepo, emailTemplateRepo);
};