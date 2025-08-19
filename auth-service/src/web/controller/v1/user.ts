import { Request, Response } from "express";
import Joi from "joi";
import { Controller } from "../controller";
import { UserServiceInterface } from "../../../service/user";

export interface UserControllerInterface {
    signup(req: Request, res: Response): any;
    login(req: Request, res: Response): any;
}

export class UserController extends Controller implements UserControllerInterface {
    constructor(private userService: UserServiceInterface) {
        super();
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
    }

    async signup(req: Request, res: Response): Promise<any> {
        const schema = Joi.object({
            name: Joi.string().min(1).max(200).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { value } = await this.validateRequest(schema, req.body);
        const response = await this.userService.signup(value);
        return this.sendResponse({ response }, 201, res);
    }

    async login(req: Request, res: Response): Promise<any> {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
        });

        const { value } = await this.validateRequest(schema, req.body);
        const response = await this.userService.login(value.email, value.password);
        return this.sendResponse({ response }, 200, res);
    }
}

export const newUserV1Controller = async (userService: UserServiceInterface): Promise<UserController> => {
    return new UserController(userService);
};