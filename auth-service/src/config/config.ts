interface MongConfig {
    MONGO_HOST: string;
    MONGO_DB: string;
}

interface JWTConfig {
    JWT_SECRET: string;
    JWT_EXPIRATION: number;
}

interface Config {
    MONGO: MongConfig;
    JWT: JWTConfig;
    APPLICATION_SERVER_PORT: number;
    APP_FORCE_SHUTDOWN_SECOND: number;
    CAMPAIGN_URL: string;
    EMAIL_URL: string;
    AUTH_URL: string;
}



const config: Config = {
    MONGO: {
        MONGO_HOST: process.env.MONGO_HOST || "mongodb://127.0.0.1:27017",
        MONGO_DB: process.env.MONGO_DB || "test"
    },
    JWT: {
        JWT_SECRET: process.env.JWT_SECRET || "defaultsecret",
        JWT_EXPIRATION: Number(process.env.JWT_EXPIRATION) || 3600
    },
    APPLICATION_SERVER_PORT: Number(process.env.APPLICATION_SERVER_PORT) || 3000,
    APP_FORCE_SHUTDOWN_SECOND: Number(process.env.APP_FORCE_SHUTDOWN_SECOND) || 30,
    CAMPAIGN_URL: process.env.CAMPAIGN_URL || "http://localhost:3001",
    EMAIL_URL: process.env.EMAIL_URL || "http://localhost:3002",
    AUTH_URL: process.env.AUTH_URL || "http://localhost:3003"
};

export default config;