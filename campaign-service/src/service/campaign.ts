import { CAMPAIGN_STATUS } from "../constant/common";
import { UserRepoInterface } from "./../repo/user";
import { KafkaMQ } from "./../infra/kafka";
import { ERROR_CODES } from "./../constant/error";
import { CampaignRepoInterface } from "../repo/campaign";
import { Controller } from "../web/controller/controller";
import { CampaignInterface } from "../model/campaign";
import { BadRequestException } from "../web/exception/bad-request-exception";
import config from "../config/config";

export interface CampaignServiceInterface {
    create(campaign: CampaignInterface): Promise<CampaignInterface>;
    updateStatus(campaignID: string, status: string): Promise<CampaignInterface>;
    getAll(): Promise<CampaignInterface[]>;
    getById(campaignID: string): Promise<CampaignInterface | null>;
    publishCampaign(campaignID: string): Promise<any>;
}

export class CampaignService extends Controller implements CampaignServiceInterface {
    constructor(public campaignRepo: CampaignRepoInterface, public userRepo: UserRepoInterface, public kafkaMQ: KafkaMQ) {
        super();
        this.campaignRepo = campaignRepo;
        this.userRepo = userRepo;
        this.kafkaMQ = kafkaMQ;
    }

    public async create(campaign: CampaignInterface): Promise<CampaignInterface> {
        const existingCampaign = await this.campaignRepo.getByName(campaign.name);
        if (existingCampaign) {
            throw new BadRequestException(ERROR_CODES.CAMPAIGN_ALREADY_EXISTS);
        }

        return await this.campaignRepo.create(campaign);
    }

    public async updateStatus(campaignID: string, status: string): Promise<CampaignInterface> {

        const campaign = await this.campaignRepo.getById(campaignID);
        if (!campaign) {
            throw new BadRequestException(ERROR_CODES.CAMPAIGN_NOT_FOUND);
        }

        return await this.campaignRepo.updateStatus(campaignID, status);
    }

    public async getAll(): Promise<CampaignInterface[]> {
        return await this.campaignRepo.getAll();
    }

    public async getById(campaignID: string): Promise<CampaignInterface | null> {
        const campaign = await this.campaignRepo.getById(campaignID);
        if (!campaign) {
            throw new BadRequestException(ERROR_CODES.CAMPAIGN_NOT_FOUND);
        }
        return campaign;
    }

    public async publishCampaign(campaignID: string): Promise<any> {
        const batchSize = 10000;
        let totalProcessedUsers = 0;

        const campaign = await this.campaignRepo.getById(campaignID);
        if (!campaign) {
            throw new BadRequestException(ERROR_CODES.CAMPAIGN_NOT_FOUND);
        }

        const totalUsers = await this.userRepo.countUsers({ isSubscribed: 'true' });
        console.log(`Total users to process: ${totalUsers}`);
        await this.campaignRepo.updateStatus(campaignID, CAMPAIGN_STATUS.SENDING);

        for (let offset = 0; offset < totalUsers; offset += batchSize) {
            const userBatch = await this.userRepo.getUsers({ isSubscribed: 'true' }, batchSize, offset);

            if (!userBatch.length) {
                return;
            }

            totalProcessedUsers += userBatch.length;

            console.log(`Fetched and processed ${userBatch.length} users in this batch. Total processed users: ${totalProcessedUsers}`);

            const users = userBatch.map((user) => ({
                to: user.email,
                name: user.name,
            }));

            // Prepare same email payloads for all users in the batch
            const emailPayloads = {
                subject: campaign.subject,
                body: campaign.body,
                templateName: "promotionalEmail",
                users,
            }

            console.log(emailPayloads);

            try {
                await this.kafkaMQ.sendToTopic(config.KAFKA.KAFKA_TOPIC, JSON.stringify(emailPayloads));
            } catch (error) {
                console.error("Error sending email payloads to Kafka:", error);
            }
        }

        await this.campaignRepo.updateStatus(campaignID, CAMPAIGN_STATUS.SENT);
        return { data: null, message: "Campaign emails have been queued for processing" };
    }
}

export const newCampaignService = async (
    campaignRepo: CampaignRepoInterface,
    userRepo: UserRepoInterface,
    kafkaMQ: KafkaMQ,
): Promise<CampaignService> => {
    return new CampaignService(campaignRepo, userRepo, kafkaMQ);
};