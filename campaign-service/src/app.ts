import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import config from "./config/config";
import { newV1Router } from "./web/router/v1/index";
import { newCampaignRepo } from "./repo/campaign";
import { newUserRepo } from "./repo/user";
import { newCampaignService } from "./service/campaign";
import { newCampaignV1Controller } from "./web/controller/v1/campaign";
import { initializeDBConnection } from "./infra/mongo";
import { initializeKafkaMQ } from "./infra/kafka";
import { globalErrorHandler } from "./web/middleware/global-error-handler";
import { newUserService } from "./service/user";
import { newUserV1Controller } from "./web/controller/v1/user";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
    // initializing db connection
    const db = await initializeDBConnection(
        config.MONGO.MONGO_HOST,
        config.MONGO.MONGO_DB
    );

    // Initialize Kafka
    const kafkaMQ = await initializeKafkaMQ(config.KAFKA.KAFKA_HOST);

    // Initialize Repo
    const campaignRepo = await newCampaignRepo(db, "campaign");
    const userRepo = await newUserRepo(db, "customer");

    // Initialize Service
    const campaignService = await newCampaignService(campaignRepo, userRepo, kafkaMQ);
    const userService = await newUserService(userRepo);

    // Initialize Controller
    const campaignV1Controller = await newCampaignV1Controller(campaignService);
    const userV1Controller = await newUserV1Controller(userService);

    // Initialize Router
    const v1Router = await newV1Router({
        campaignController: campaignV1Controller,
        userController: userV1Controller
    });

    app.use(morgan("short"));
    app.use("/api/v1", v1Router);
    app.use(globalErrorHandler);
})();

export default app;
