import { EMAIL_QUEUE_STATUS } from "./../constant/common";

export interface EmailQueueInterface {
    from: string;
    to: string;
    replyTo: string;
    cc?: string[];
    bcc?: string[];
    subject: string;
    client: string;
    service: string;
    sender: string;
    message?: string;
    data?: string;
    templateName: string;
    status: EMAIL_QUEUE_STATUS;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export class EmailQueueModel implements EmailQueueInterface {
    from: string;
    to: string;
    replyTo: string;
    cc?: string[];
    bcc?: string[];
    subject: string;
    client: string;
    service: string;
    sender: string;
    message?: string;
    data?: string;
    templateName: string;
    status: EMAIL_QUEUE_STATUS;
    createdAt?: Date | string;
    updatedAt?: Date | string;

    constructor({
        from,
        to,
        replyTo,
        cc,
        bcc,
        subject,
        client,
        service,
        sender,
        message,
        data,
        templateName,
        status,
        createdAt,
        updatedAt,
    }: EmailQueueInterface) {
        this.from = from || "";
        this.to = to || "";
        this.replyTo = replyTo || "";
        this.cc = cc ?? [];
        this.bcc = bcc ?? [];
        this.subject = subject || "";
        this.client = client || "";
        this.service = service || "";
        this.sender = sender || "";
        this.message = message || "";
        this.data = data || "";
        this.templateName = templateName || "";
        this.status = status;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }
}
