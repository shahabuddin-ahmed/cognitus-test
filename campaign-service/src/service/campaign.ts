import { ERROR_CODES } from "./../constant/error";
import { CampaignRepoInterface } from "../repo/campaign";
import { Controller } from "../web/controller/controller";
import { CampaignInterface } from "../model/campaign";
import { BadRequestException } from "../web/exception/bad-request-exception";

export interface CampaignServiceInterface {
    create(campaign: CampaignInterface): Promise<CampaignInterface>;
    updateStatus(campaignID: string, status: string): Promise<CampaignInterface>;
    getAll(): Promise<CampaignInterface[]>;
    getById(campaignID: string): Promise<CampaignInterface | null>;
}

export class CampaignService extends Controller implements CampaignServiceInterface {
    constructor(public campaignRepo: CampaignRepoInterface) {
        super();
        this.campaignRepo = campaignRepo;
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
}

export const newCampaignService = async (
    campaignRepo: CampaignRepoInterface
): Promise<CampaignService> => {
    return new CampaignService(campaignRepo);
};