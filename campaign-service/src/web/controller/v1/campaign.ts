import { CAMPAIGN_STATUS } from "./../../../constant/common";
import { Request, Response } from "express";
import { CampaignServiceInterface } from "../../../service/campaign";
import { Controller } from "../controller";
import Joi from "joi";

export interface CampaignControllerInterface {
    create(req: Request, res: Response): any;
    updateStatus(req: Request, res: Response): any;
    getAll(req: Request, res: Response): any;
    getById(req: Request, res: Response): any;
    publishCampaign(req: Request, res: Response): any;
}

export class CampaignController extends Controller implements CampaignControllerInterface {
    campaignService: CampaignServiceInterface;

    constructor(campaignService: CampaignServiceInterface) {
        super();
        this.campaignService = campaignService;
        this.create = this.create.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.publishCampaign = this.publishCampaign.bind(this);
    }

    async create(req: Request, res: Response): Promise<any> {
        const schema = Joi.object({
            name: Joi.string().required(),
            subject: Joi.string().required(),
            body: Joi.string().required(),
            scheduledTime: Joi.date().iso().required(),
            status: Joi.string().valid(...Object.values(CAMPAIGN_STATUS)).default(CAMPAIGN_STATUS.SCHEDULED),
        });

        const { value } = await this.validateRequest(schema, req.body);

        const data = await this.campaignService.create(value);
        return this.sendResponse({ response: data }, 201, res);
    }

    async updateStatus(req: Request, res: Response): Promise<any> {

        const schema = Joi.object({
            campaignID: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
            status: Joi.string().valid(...Object.values(CAMPAIGN_STATUS)).required()
        });

        const { value } = await this.validateRequest(schema, { ...req.params, ...req.body });

        const updatedCampaign = await this.campaignService.updateStatus(value.campaignID, value.status);
        return this.sendResponse({ response: updatedCampaign }, 200, res);
    }

    async getAll(req: Request, res: Response): Promise<any> {

        const campaigns = await this.campaignService.getAll();
        return this.sendResponse({ response: campaigns }, 200, res);
    }

    async getById(req: Request, res: Response): Promise<any> {

        const schema = Joi.object({
            campaignID: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        });

        const { value } = await this.validateRequest(schema, req.params);

        const campaign = await this.campaignService.getById(value.campaignID);
        return this.sendResponse({ response: campaign }, 200, res);
    }

    public async publishCampaign(req: Request, res: Response): Promise<any> {

        const schema = Joi.object({
            campaignID: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        });

        const { value } = await this.validateRequest(schema, req.params);
        const response = await this.campaignService.publishCampaign(value.campaignID);

        return this.sendResponse({ response }, 200, res);
    }
}

export const newCampaignV1Controller = async (campaignService: CampaignServiceInterface):
    Promise<CampaignController> => {
    return new CampaignController(campaignService);
};