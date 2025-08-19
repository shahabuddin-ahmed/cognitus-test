import { CampaignControllerInterface } from "../../controller/v1/campaign";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";
import { authenticated } from "../../../web/middleware/auth";

export const newCampaignRouter = async (
    campaignController: CampaignControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/create", authenticated, asyncHandler(campaignController.create));
    router.get('/list', authenticated, asyncHandler(campaignController.getAll));
    router.get('/details/:campaignID', authenticated, asyncHandler(campaignController.getById));
    router.patch('/status/:campaignID', authenticated, asyncHandler(campaignController.updateStatus));
    router.get('/publish/:campaignID', authenticated, asyncHandler(campaignController.publishCampaign));

    return router;
};