import { TEMPLATE_STATUS } from "./../constant/common";

export interface AttachmentInterface {
    name: string;
    context: Record<string, unknown>;
}

export interface EmailTemplateInterface {
    sender: string;
    client: string;
    service: string;
    templateName: string;
    to: string;
    subject: string;
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    context: Record<string, unknown>;
    attachment: AttachmentInterface[];
    status: TEMPLATE_STATUS;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export class EmailTemplateModel implements EmailTemplateInterface {
    sender: string;
    client: string;
    service: string;
    templateName: string;
    to: string;
    subject: string;
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    context: Record<string, unknown>;
    attachment: AttachmentInterface[];
    status: TEMPLATE_STATUS;
    createdAt?: Date | string;
    updatedAt?: Date | string;

    constructor(emailTemplate: EmailTemplateInterface) {
        const {
            sender,
            client,
            service,
            templateName,
            to,
            subject,
            cc,
            bcc,
            replyTo,
            context,
            attachment,
            status,
            createdAt,
            updatedAt
        } = emailTemplate;

        this.sender = sender;
        this.client = client;
        this.service = service;
        this.templateName = templateName;
        this.to = to;
        this.subject = subject;
        this.cc = cc;
        this.bcc = bcc;
        this.replyTo = replyTo;
        this.context = context;
        this.attachment = attachment;
        this.status = status;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }
}