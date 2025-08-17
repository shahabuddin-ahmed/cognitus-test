import { CAMPAIGN_STATUS } from "../constant/common";

export interface CampaignInterface {
    id?: string;
    name: string;
    subject: string;
    body: string;
    scheduledTime: Date | string;
    status: CAMPAIGN_STATUS;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export class CampaignModel implements CampaignInterface {
    id?: string;
    name: string;
    subject: string;
    body: string;
    scheduledTime: Date | string;
    status: CAMPAIGN_STATUS;
    createdAt: Date | string;
    updatedAt: Date | string;

    constructor(campaign: CampaignInterface) {
        const { id, name, subject, body, scheduledTime, status, createdAt, updatedAt } = campaign;
        this.id = id;
        this.name = name;
        this.subject = subject;
        this.body = body;
        this.scheduledTime = scheduledTime ?? new Date();
        this.status = status ?? CAMPAIGN_STATUS.SCHEDULED;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }
}

export const newCampaignModel = async (campaign: CampaignInterface) => {
    return new CampaignModel(campaign);
};