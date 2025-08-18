import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import config from "./config/config";
import { newV1Router } from "./web/router/v1/index";
import { newEmailQueueRepo } from "./repo/email-queue";
import { newEmailTemplateRepo } from "./repo/email-template";
import { newEmailSenderService } from "./service/email-sender";
import { initializeDBConnection } from "./infra/mongo";
import { initializeKafkaMQ } from "./infra/kafka";

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
    const kafkaMQ = await initializeKafkaMQ(config.KAFKA.KAFKA_HOST, config.KAFKA.KAFKA_TOPIC);

    // Initialize Repo
    const emailTemplateRepo = await newEmailTemplateRepo(db, "email-template");
    const emailQueueRepo = await newEmailQueueRepo(db, "email-queue");

    // Initialize Service
    const campaignService = await newEmailSenderService(kafkaMQ, emailQueueRepo, emailTemplateRepo);

    // Initialize Router
    const v1Router = await newV1Router();

    app.use(morgan("short"));
    app.use("/api/v1", v1Router);
})();

export default app;
