import { BadRequestException } from './../web/exception/bad-request-exception';
import { EmailTemplateRepoInterface } from "../repo/email-template";
import { EmailTemplateInterface } from "../model/email-template";
import { ERROR_CODES } from "../constant/error";

export interface EmailTemplateServiceInterface {
    create(emailTemplate: EmailTemplateInterface): Promise<EmailTemplateInterface>;
    getById(emailTemplateId: string): Promise<EmailTemplateInterface | null>;
    getByName(emailTemplateName: string): Promise<EmailTemplateInterface | null>;
    getAll(skip: number, limit: number): Promise<EmailTemplateInterface[]>;
    update(emailTemplateId: string, emailTemplate: EmailTemplateInterface): Promise<EmailTemplateInterface | null>;
    delete(emailTemplateId: string): Promise<boolean>;
}

export class EmailTemplateService implements EmailTemplateServiceInterface {
    constructor(private emailTemplateRepo: EmailTemplateRepoInterface) {}

    public async create(emailTemplate: EmailTemplateInterface): Promise<EmailTemplateInterface> {
        const existingTemplate = await this.emailTemplateRepo.getByName(emailTemplate.templateName);
        if (existingTemplate) {
            throw new BadRequestException(ERROR_CODES.E_EMAIL_TEMPLATE_ALREADY_EXISTS);
        }
        return this.emailTemplateRepo.create(emailTemplate);
    }

    public async getById(emailTemplateId: string): Promise<EmailTemplateInterface | null> {
        const emailTemplate = await this.emailTemplateRepo.getById(emailTemplateId);
        if (!emailTemplate) {
            throw new BadRequestException(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND);
        }
        return emailTemplate;
    }

    public async getByName(emailTemplateName: string): Promise<EmailTemplateInterface | null> {
        const emailTemplate = await this.emailTemplateRepo.getByName(emailTemplateName);
        if (!emailTemplate) {
            throw new BadRequestException(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND);
        }
        return emailTemplate;
    }

    public async getAll(skip: number, limit: number): Promise<EmailTemplateInterface[]> {
        return this.emailTemplateRepo.getAll(skip, limit);
    }

    public async update(emailTemplateId: string, emailTemplate: EmailTemplateInterface): Promise<EmailTemplateInterface | null> {
        return this.emailTemplateRepo.update(emailTemplateId, emailTemplate);
    }

    public async delete(emailTemplateId: string): Promise<boolean> {
        return this.emailTemplateRepo.delete(emailTemplateId);
    }
}

export const newEmailTemplateService = (emailTemplateRepo: EmailTemplateRepoInterface): EmailTemplateService => {
    return new EmailTemplateService(emailTemplateRepo);
};