import { UserControllerInterface } from "../../controller/v1/user";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newUserRouter = async (
    userController: UserControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/create", asyncHandler(userController.create));
    router.get("/details/:userId", asyncHandler(userController.getById));
    router.get("/list", asyncHandler(userController.getAll));
    router.get("/count", asyncHandler(userController.count));

    return router;
};