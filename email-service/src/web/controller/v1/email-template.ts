import { TEMPLATE_STATUS } from './../../../constant/common';
import { Request, Response } from "express";
import { EmailTemplateServiceInterface } from "../../../service/email-template";
import { Controller } from "../controller";
import Joi from "joi";

export interface EmailTemplateControllerInterface {
    create(req: Request, res: Response): Promise<any>;
    getById(req: Request, res: Response): Promise<any>;
    getByName(req: Request, res: Response): Promise<any>;
    getAll(req: Request, res: Response): Promise<any>;
    update(req: Request, res: Response): Promise<any>;
    delete(req: Request, res: Response): Promise<any>;
}

export class EmailTemplateController extends Controller implements EmailTemplateControllerInterface {
    private emailTemplateService: EmailTemplateServiceInterface;

    constructor(emailTemplateService: EmailTemplateServiceInterface) {
        super();
        this.emailTemplateService = emailTemplateService;

        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
        this.getByName = this.getByName.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req: Request, res: Response): Promise<any> {
        const schema = Joi.object({
            sender: Joi.string().required(),
            client: Joi.string().required(),
            service: Joi.string().required(),
            templateName: Joi.string().required(),
            cc: Joi.array().items(Joi.string().email()).optional(),
            bcc: Joi.array().items(Joi.string().email()).optional(),
            replyTo: Joi.string().email().optional(),
            context: Joi.object().required(),
            attachment: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    context: Joi.object().required(),
                })
            ).required(),
            status: Joi.string().valid(...Object.values(TEMPLATE_STATUS)).required()
        });

        const { value } = await this.validateRequest(schema, req.body);

        const emailTemplate = await this.emailTemplateService.create(value);
        return this.sendResponse({ response: emailTemplate }, 201, res);
    }

    async getById(req: Request, res: Response): Promise<any> {
        const { emailTemplateId } = req.params;

        const response = await this.emailTemplateService.getById(emailTemplateId);
        return this.sendResponse({ response }, 200, res);
    }

    // Get Email Template by Name
    async getByName(req: Request, res: Response): Promise<any> {
        const { emailTemplateName } = req.params;

        const response = await this.emailTemplateService.getByName(emailTemplateName);
        return this.sendResponse({ response }, 200, res);
    }

    async getAll(req: Request, res: Response): Promise<any> {
        const { skip, limit } = req.query;
        const response = await this.emailTemplateService.getAll(Number(skip), Number(limit));

        return this.sendResponse({ response }, 200, res);
    }

    async update(req: Request, res: Response): Promise<any> {
        const { emailTemplateId } = req.params;
        const schema = Joi.object({
            name: Joi.string().optional(),
            subject: Joi.string().optional(),
            body: Joi.string().optional(),
            cc: Joi.array().items(Joi.string().email()).optional(),
            bcc: Joi.array().items(Joi.string().email()).optional(),
        });

        const { value } = await this.validateRequest(schema, req.body);

        const updatedEmailTemplate = await this.emailTemplateService.update(emailTemplateId, value);
        return this.sendResponse({ response: updatedEmailTemplate }, 200, res);
    }

    async delete(req: Request, res: Response): Promise<any> {
        const { emailTemplateId } = req.params;

        await this.emailTemplateService.delete(emailTemplateId);
        return this.sendResponse({ response: null, message: "Email template deleted successfully" }, 200, res);
    }
}

export const newEmailTemplateController = (emailTemplateService: EmailTemplateServiceInterface) =>
    new EmailTemplateController(emailTemplateService);