import { EmailTemplateControllerInterface } from "../../controller/v1/email-template";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newEmailTemplateRouter = async (
    emailTemplateController: EmailTemplateControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/create", asyncHandler(emailTemplateController.create));
    router.get("/details/:emailTemplateId", asyncHandler(emailTemplateController.getById));
    router.get("/name/:emailTemplateName", asyncHandler(emailTemplateController.getByName));
    router.get("/list", asyncHandler(emailTemplateController.getAll));
    router.put("/update/:emailTemplateId", asyncHandler(emailTemplateController.update));
    router.delete("/delete/:emailTemplateId", asyncHandler(emailTemplateController.delete));

    return router;
};