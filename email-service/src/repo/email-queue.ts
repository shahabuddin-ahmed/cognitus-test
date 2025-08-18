import { EmailQueueInterface } from './../model/email-queue';
import { DBInterface } from '../infra/db';

export interface EmailQueueRepoInterface {
    create(emailQueue: EmailQueueInterface): Promise<EmailQueueInterface>;
    getById(emailQueueId: string): Promise<EmailQueueInterface | null>;
    getAll(skip: number, limit: number): Promise<EmailQueueInterface[]>;
    update(emailQueueId: string, emailQueue: EmailQueueInterface): Promise<EmailQueueInterface | null>;
    delete(emailQueueId: string): Promise<boolean>;
}

export class EmailQueueRepo implements EmailQueueRepoInterface {
    constructor(private db: DBInterface, private collection: string) {}

    public async create(emailQueue: EmailQueueInterface): Promise<EmailQueueInterface> {
        return this.db.create(this.collection, emailQueue);
    }

    public async getById(emailQueueId: string): Promise<EmailQueueInterface | null> {
        return this.db.findOne(this.collection, { _id: emailQueueId });
    }

    public async getAll(skip: number, limit: number): Promise<EmailQueueInterface[]> {
        return this.db.find(this.collection, {}, { skip, limit });
    }

    public async update(emailQueueId: string, emailQueue: EmailQueueInterface): Promise<EmailQueueInterface | null> {
        return this.db.update(this.collection, { _id: emailQueueId }, emailQueue);
    }

    public async delete(emailQueueId: string): Promise<boolean> {
        const result = await this.db.delete(this.collection, { _id: emailQueueId });
        return result.deletedCount > 0;
    }
}