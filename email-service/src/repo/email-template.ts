import { EmailTemplateInterface } from "./../model/email-template";
import { DBInterface } from "../infra/db";

export interface EmailTemplateRepoInterface {
    create(emailTemplate: EmailTemplateInterface): Promise<EmailTemplateInterface>;
    getById(emailTemplateId: string): Promise<EmailTemplateInterface | null>;
    getByName(emailTemplateName: string): Promise<EmailTemplateInterface | null>;
    getAll(skip: number, limit: number): Promise<EmailTemplateInterface[]>;
    update(emailTemplateId: string, emailTemplate: EmailTemplateInterface): Promise<EmailTemplateInterface | null>;
    delete(emailTemplateId: string): Promise<boolean>;
}

export class EmailTemplateRepo implements EmailTemplateRepoInterface {
    constructor(private db: DBInterface, private collection: string) {}

    public async create(emailTemplate: EmailTemplateInterface): Promise<EmailTemplateInterface> {
        return this.db.create(this.collection, emailTemplate);
    }

    public async getById(emailTemplateId: string): Promise<EmailTemplateInterface | null> {
        return this.db.findOne(this.collection, { _id: emailTemplateId });
    }

    public async getByName(emailTemplateName: string): Promise<EmailTemplateInterface | null> {
        return this.db.findOne(this.collection, { name: emailTemplateName });
    }

    public async getAll(skip: number, limit: number): Promise<EmailTemplateInterface[]> {
        return this.db.find(this.collection, {}, { skip, limit });
    }

    public async update(emailTemplateId: string, emailTemplate: EmailTemplateInterface): Promise<EmailTemplateInterface | null> {
        return this.db.update(this.collection, { _id: emailTemplateId }, emailTemplate);
    }

    public async delete(emailTemplateId: string): Promise<boolean> {
        const result = await this.db.delete(this.collection, { _id: emailTemplateId });
        return result.deletedCount > 0;
    }
}