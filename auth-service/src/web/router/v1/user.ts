import { UserControllerInterface } from "../../controller/v1/user";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newUserRouter = async (
    userController: UserControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/signup", asyncHandler(userController.signup));
    router.post("/login", asyncHandler(userController.login));

    return router;
};