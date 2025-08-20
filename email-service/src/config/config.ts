interface MongConfig {
    MONGO_HOST: string;
    MONGO_DB: string;
}

interface KafkaConfig {
    KAFKA_HOST: string;
    KAFKA_TOPIC: string;
    KAFKA_GROUP_ID: string;
}

interface EmailConfig {
    name: string;
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    };
    sender: {
        from: string;
        name: string;
    };
}

interface AwsConfig {
    ACCESS_KEY_ID: string;
    SECRET_ACCESS_KEY: string;
    REGION: string;
}

interface Config {
    MONGO: MongConfig;
    KAFKA: KafkaConfig;
    APPLICATION_SERVER_PORT: number;
    EMAIL: EmailConfig;
    AWS: AwsConfig;
    APP_FORCE_SHUTDOWN_SECOND: number;
}

const config: Config = {
    MONGO: {
        MONGO_HOST: process.env.MONGO_HOST || "mongodb://127.0.0.1:27017",
        MONGO_DB: process.env.MONGO_DB || "test"
    },
    KAFKA: {
        KAFKA_HOST: process.env.KAFKA_HOST || "localhost:29092",
        KAFKA_TOPIC: process.env.KAFKA_TOPIC || "email-topic",
        KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || "email-consumer-group"
    },
    EMAIL: {
        name: process.env.SENDER_NAME || "default-sender",
        host: process.env.SENDER_HOST || "smtp.gmail.com",
        port: Number(process.env.SENDER_PORT) || 587,
        auth: {
            user: process.env.SENDER_AUTH_USER || "your-email@gmail.com",
            pass: process.env.SENDER_AUTH_PASS || "your-email-password"
        },
        sender: {
            from: process.env.SENDER_SENDER_FROM || "your-email@gmail.com",
            name: process.env.SENDER_SENDER_NAME || "Default Sender"
        }
    },
    AWS: {
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "your-access-key-id",
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "your-secret-access-key",
        REGION: process.env.AWS_REGION || "us-east-1"
    },
    APPLICATION_SERVER_PORT: Number(process.env.APPLICATION_SERVER_PORT) || 3002,
    APP_FORCE_SHUTDOWN_SECOND: Number(process.env.APP_FORCE_SHUTDOWN_SECOND) || 30
};

export default config;