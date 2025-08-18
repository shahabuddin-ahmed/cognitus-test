import { Request, Response } from "express";
import Joi from "joi";
import { Controller } from "../controller";
import { UserServiceInterface } from "../../../service/user";

export interface UserControllerInterface {
    create(req: Request, res: Response): any;
    getById(req: Request, res: Response): any;
    getAll(req: Request, res: Response): any;
    count(req: Request, res: Response): any;
}

export class UserController extends Controller implements UserControllerInterface {
    constructor(private userService: UserServiceInterface) {
        super();
        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.count = this.count.bind(this);
    }

    async create(req: Request, res: Response): Promise<any> {
        const schema = Joi.object({
            name: Joi.string().min(1).max(200).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            isSubscribed: Joi.boolean().default(true),
        });

        const { value } = await this.validateRequest(schema, req.body);
        const data = await this.userService.create(value);
        return this.sendResponse({ response: data }, 201, res);
    }

    async getById(req: Request, res: Response): Promise<any> {
        const schema = Joi.object({
            userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        });

        const { value } = await this.validateRequest(schema, req.params);
        const user = await this.userService.getById(value.userId);
        return this.sendResponse({ response: user }, 200, res);
    }

    async getAll(req: Request, res: Response): Promise<any> {
        const schema = Joi.object({
            isSubscribed: Joi.boolean().optional(),
            limit: Joi.number().integer().min(1).max(100000).default(50),
            offset: Joi.number().integer().min(0).default(0),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const predicate: Record<string, any> = {};
        if (typeof value.isSubscribed === "boolean") {
            predicate.isSubscribed = value.isSubscribed;
        }

        const users = await this.userService.getAll(predicate, value.limit, value.offset);
        return this.sendResponse({ response: users }, 200, res);
    }

    async count(req: Request, res: Response): Promise<any> {
        const schema = Joi.object({
            isSubscribed: Joi.boolean().optional(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const predicate: Record<string, any> = {};
        if (typeof value.isSubscribed === "boolean") {
            predicate.isSubscribed = value.isSubscribed;
        }

        const total = await this.userService.count(predicate);
        return this.sendResponse({ response: { total } }, 200, res);
    }
}

export const newUserV1Controller = async (userService: UserServiceInterface): Promise<UserController> => {
    return new UserController(userService);
};