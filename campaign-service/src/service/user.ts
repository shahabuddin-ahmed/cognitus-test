import bcrypt from "bcrypt";
import { BadRequestException } from "../web/exception/bad-request-exception";
import { UserRepoInterface } from "../repo/user";
import { Controller } from "../web/controller/controller";
import { UserInterface } from "../model/user";
import { ERROR_CODES } from "../constant/error";

export interface UserServiceInterface {
    create(user: UserInterface): Promise<UserInterface>;
    getById(userId: string): Promise<UserInterface | null>;
    getAll(predicate: Record<string, any>, limit: number, offset: number): Promise<UserInterface[]>;
    count(predicate: Record<string, any>): Promise<number>;
}

export class UserService extends Controller implements UserServiceInterface {
    constructor(private userRepo: UserRepoInterface) {
        super();
        this.userRepo = userRepo;
    }

    public async create(user: UserInterface): Promise<UserInterface> {
        const existUser = await this.userRepo.getByEmail(user.email);
        if (existUser) {
            throw new BadRequestException(ERROR_CODES.USER_ALREADY_EXISTS);
        }
        const hashedPassword = await this.hashPassword(user.password);
        return await this.userRepo.create({ ...user, password: hashedPassword });
    }

    private hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    public async getById(userId: string): Promise<UserInterface | null> {
        const user = await this.userRepo.getById(userId);
        if (!user) {
            throw new BadRequestException(ERROR_CODES.USER_NOT_FOUND);
        }
        return user;
    }

    public async getAll(predicate: Record<string, any>, limit: number, offset: number): Promise<UserInterface[]> {
        return this.userRepo.getUsers(predicate, limit, offset);
    }

    public async count(predicate: Record<string, any>): Promise<number> {
        return this.userRepo.countUsers(predicate);
    }
}

export const newUserService = async (userRepo: UserRepoInterface): Promise<UserService> => {
    return new UserService(userRepo);
};