import { EMAIL_QUEUE_STATUS } from "./../constant/common";

export interface EmailQueueInterface {
    to: string;
    replyTo?: string;
    subject: string;
    body?: string;
    status: EMAIL_QUEUE_STATUS;
    errorMessage?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cc?: string[];
    bcc?: string[];
    templateName?: string;
    from?: string;
    client?: string;
    service?: string;
    sender?: string;
    message?: string;
    data?: string;
}

export class EmailQueueModel implements EmailQueueInterface {
    to: string;
    replyTo?: string;
    subject: string;
    body?: string;
    status: EMAIL_QUEUE_STATUS;
    errorMessage?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cc?: string[];
    bcc?: string[];
    templateName?: string;
    from?: string;
    client?: string;
    service?: string;
    sender?: string;
    message?: string;
    data?: string;

    constructor(emailQueue: EmailQueueInterface) {
        const { to, replyTo, status, subject, body, createdAt, updatedAt, errorMessage, cc, bcc, templateName, from, client, service, sender, message, data } = emailQueue;
        this.to = to;
        this.replyTo = replyTo;
        this.subject = subject;
        this.body = body;
        this.errorMessage = errorMessage;
        this.status = status;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
        this.cc = cc;
        this.bcc = bcc;
        this.templateName = templateName;
        this.from = from;
        this.client = client;
        this.service = service;
        this.sender = sender;
        this.message = message;
        this.data = data;
    }
}