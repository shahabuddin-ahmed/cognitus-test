import { IncomingHttpHeaders } from "http";
import { Request } from "express";
import { ERROR_CODES, errorMessages } from "../constant/error";


export const getreqHeaders = async (req: Request): Promise<IncomingHttpHeaders> => {
    const reqHeaders = req.headers, headers: IncomingHttpHeaders = {};

    if (reqHeaders["user-agent"]) {
        headers["user-agent"] = reqHeaders["user-agent"];
    }

    if (reqHeaders["content-type"]) {
        headers["content-type"] = reqHeaders["content-type"];
    }

    if (reqHeaders["accesstoken"]) {
        headers["access-token"] = reqHeaders["accesstoken"];
    }

    if (reqHeaders["x-original-forwarded-for"]) {
        headers["x-original-forwarded-for"] = reqHeaders["x-original-forwarded-for"];
    }

    if (reqHeaders["x-forwarded-for"]) {
        headers["x-forwarded-for"] = reqHeaders["x-forwarded-for"];
    }

    return headers;
};

export function retrieveErrorMessage(errorCode: ERROR_CODES): string {
    return errorMessages[`${errorCode}`].message;
}