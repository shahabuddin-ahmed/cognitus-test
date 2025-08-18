import { CampaignControllerInterface } from "../../controller/v1/campaign";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newCampaignRouter = async (
    campaignController: CampaignControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/create", asyncHandler(campaignController.create));
    router.get('/list', asyncHandler(campaignController.getAll));
    router.get('/details/:campaignID', asyncHandler(campaignController.getById));
    router.patch('/status/:campaignID', asyncHandler(campaignController.updateStatus));
    router.get('/publish/:campaignID', asyncHandler(campaignController.publishCampaign));

    return router;
};