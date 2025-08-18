interface MongConfig {
    MONGO_HOST: string;
    MONGO_DB: string;
}

interface KafkaConfig {
    KAFKA_HOST: string;
    KAFKA_TOPIC: string;
}

interface Config {
    MONGO: MongConfig;
    KAFKA: KafkaConfig;
    APPLICATION_SERVER_PORT: number;
    APP_FORCE_SHUTDOWN_SECOND: number;
}

const config: Config = {
    MONGO: {
        MONGO_HOST: process.env.MONGO_HOST || "mongodb://127.0.0.1:27017",
        MONGO_DB: process.env.MONGO_DB || "test"
    },
    KAFKA: {
        KAFKA_HOST: process.env.KAFKA_HOST || "localhost:29092",
        KAFKA_TOPIC: process.env.KAFKA_TOPIC || "email-topic"
    },
    APPLICATION_SERVER_PORT: Number(process.env.APPLICATION_SERVER_PORT) || 3000,
    APP_FORCE_SHUTDOWN_SECOND: Number(process.env.APP_FORCE_SHUTDOWN_SECOND) || 30
};

export default config;