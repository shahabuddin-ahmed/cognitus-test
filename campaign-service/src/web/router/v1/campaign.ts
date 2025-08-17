import { CampaignControllerInterface } from "../../controller/v1/campaign";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newCampaignRouter = async (
    campaignController: CampaignControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/create", asyncHandler(campaignController.create));
    router.get('/list', asyncHandler(campaignController.getAll));
    router.get('/campaign/:campaignID', asyncHandler(campaignController.getById));
    router.patch('/campaign/:campaignID/status', asyncHandler(campaignController.updateStatus));

    return router;
};