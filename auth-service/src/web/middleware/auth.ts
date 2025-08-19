import { JwtPayload, verify } from "jsonwebtoken";
import config from "../../config/config";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exception/unauthrozied-exception";
import { ERROR_CODES } from "../../constant/error";

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
};

export const authenticated = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new UnauthorizedException(ERROR_CODES.E_INVALID_TOKEN,  "Please provide the access token");
        }

        const token = authorizationHeader.split(" ")[1];
        const jwtPayload = verify(token, config.JWT.JWT_SECRET);
        req.user = jwtPayload as JwtPayload;
        next();

    } catch (err) {
        console.error("Error caught by auth middleware: ", err);
        next(new UnauthorizedException(ERROR_CODES.E_INVALID_TOKEN,  "Invalid access token"));
    }
}