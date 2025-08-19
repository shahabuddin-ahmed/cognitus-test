import { HTTP_METHOD, SERVICE_NAME } from "./../../../constant/common";
import { Request, Response } from "express";
import { Controller } from "../controller";

const URL_PREFIX = 'api/v1/campaign';

export interface CampaignControllerInterface {
    create(req: Request, res: Response): any;
    updateStatus(req: Request, res: Response): any;
    getAll(req: Request, res: Response): any;
    getById(req: Request, res: Response): any;
    publishCampaign(req: Request, res: Response): any;
}

export class CampaignController extends Controller implements CampaignControllerInterface {

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.publishCampaign = this.publishCampaign.bind(this);
    }

    async create(req: Request, res: Response): Promise<any> {
        const { response, statusCode } = await this.apiRequest({
            serviceType: SERVICE_NAME.CAMPAIGN,
            endpoint: `${URL_PREFIX}/create`,
            method: HTTP_METHOD.POST,
            headers: await this.getHeaders(req),
            data: req.body,
        });

        return this.sendResponse(response, statusCode, res);
    }

    async getAll(req: Request, res: Response): Promise<any> {
        const { response, statusCode } = await this.apiRequest({
            serviceType: SERVICE_NAME.CAMPAIGN,
            endpoint: `${URL_PREFIX}/list`,
            method: HTTP_METHOD.GET,
            headers: await this.getHeaders(req),
            data: req.body,
        });

        return this.sendResponse(response, statusCode, res);
    }

    async getById(req: Request, res: Response): Promise<any> {
        const { response, statusCode } = await this.apiRequest({
            serviceType: SERVICE_NAME.CAMPAIGN,
            endpoint: `${URL_PREFIX}/details/${req.params.campaignID}`,
            method: HTTP_METHOD.GET,
            headers: await this.getHeaders(req),
            data: req.body,
        });

        return this.sendResponse(response, statusCode, res);
    }

    async updateStatus(req: Request, res: Response): Promise<any> {
        const { response, statusCode } = await this.apiRequest({
            serviceType: SERVICE_NAME.CAMPAIGN,
            endpoint: `${URL_PREFIX}/status/${req.params.campaignID}`,
            method: HTTP_METHOD.PATCH,
            headers: await this.getHeaders(req),
            data: req.body,
        });

        return this.sendResponse(response, statusCode, res);
    }

    async publishCampaign(req: Request, res: Response): Promise<any> {
        const { response, statusCode } = await this.apiRequest({
            serviceType: SERVICE_NAME.CAMPAIGN,
            endpoint: `${URL_PREFIX}/publish/${req.params.campaignID}`,
            method: HTTP_METHOD.GET,
            headers: await this.getHeaders(req),
            data: req.body,
        });

        return this.sendResponse(response, statusCode, res);
    }
}

export const newCampaignV1Controller = async ():
    Promise<CampaignController> => {
    return new CampaignController();
};