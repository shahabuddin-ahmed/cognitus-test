import { EmailTemplateControllerInterface } from './../../controller/v1/email-template';
import { Router } from "express";
import { NotFoundException } from "../../exception/not-found-exception";
import { ERROR_CODES } from "../../../constant/error";
import { newHealthRouter } from "./health";
import { newEmailTemplateRouter } from "./email-template";

export const newV1Router = async (emailTemplateController: EmailTemplateControllerInterface): Promise<Router> => {
    const v1 = Router();
    v1.use("/health", await newHealthRouter());
    v1.use("/email-template", await newEmailTemplateRouter(emailTemplateController));

    v1.use("*", (_req, res) => {
        console.log(`not_found_for_v1`, _req.method, _req.baseUrl);
        throw new NotFoundException(ERROR_CODES.E_PAGE_NOT_FOUND, "", [
            `Cannot ${_req.method} ${_req.baseUrl}`,
        ]);
    });

    return v1;
};
