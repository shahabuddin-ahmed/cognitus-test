import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { BadRequestException } from "../web/exception/bad-request-exception";
import { UserRepoInterface } from "../repo/user";
import { Controller } from "../web/controller/controller";
import { UserInterface } from "../model/user";
import { ERROR_CODES } from "../constant/error";
import config from "../config/config";

export interface UserServiceInterface {
    signup(user: UserInterface): Promise<UserInterface>;
    login(email: string, password: string): Promise<UserInterface | null>;
}

export class UserService extends Controller implements UserServiceInterface {
    constructor(private userRepo: UserRepoInterface) {
        super();
        this.userRepo = userRepo;
    }

    public async signup(user: UserInterface): Promise<UserInterface> {
        const existUser = await this.userRepo.getByEmail(user.email);
        if (existUser) {
            throw new BadRequestException(ERROR_CODES.USER_ALREADY_EXISTS);
        }
        const hashedPassword = await this.hashPassword(user.password!);
        const { password, ...createdUser } = await this.userRepo.create({ ...user, password: hashedPassword });
        return createdUser;
    }

    public async login(email: string, password: string): Promise<UserInterface | null> {
        const checkUser = await this.userRepo.getByEmail(email);
        if (!checkUser) {
            throw new BadRequestException(ERROR_CODES.USER_NOT_FOUND);
        }

        const { password: checkPasswordHash, ...updatedUser } = checkUser;

		const checkPassword = await this.checkPassword(password, checkPasswordHash!);
		if (!checkPassword) {
			throw new BadRequestException(ERROR_CODES.INVALID_CREDENTIALS);
		}

		const accessToken = await this.createToken(checkUser);
        return { ...updatedUser, accessToken };
    }

    private hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    private async checkPassword(attemptPass: string, hash: string): Promise<boolean> {
		return bcrypt.compare(attemptPass, hash);
	}

	private async createToken(user: UserInterface): Promise<string> {
		const payload = {
			userID: user.id,
            name: user.name,
			email: user.email
		};

        return sign(payload, config.JWT.JWT_SECRET, { algorithm: "HS256", expiresIn: config.JWT.JWT_EXPIRATION });
	}
}

export const newUserService = async (userRepo: UserRepoInterface): Promise<UserService> => {
    return new UserService(userRepo);
};