import { Kafka, Producer, ProducerRecord, logLevel } from 'kafkajs';
import config from "../config/config";

export interface PublishOption {
    key?: string;
    partition?: number;
    timestamp?: number;
    headers?: any;
    messageId?: string;
}

export interface MQInterface {
    sendToTopic(topic: string, message: string, option?: PublishOption): Promise<boolean>;
}

export class KafkaMQ implements MQInterface {
    private kafkaProducer: Producer;

    constructor(kafkaProducer: Producer) {
        this.kafkaProducer = kafkaProducer;
    }

    public async sendToTopic(topic: string, message: string, option?: PublishOption): Promise<boolean> {
        const payload: ProducerRecord = {
            topic: topic,
            messages: [{
                value: message,
                key: option?.key,
                headers: option?.headers,
                timestamp: option?.timestamp ? new Date(option.timestamp).toISOString() : undefined
            }]
        };

        try {
            await this.kafkaProducer.send(payload);
            console.log("Message sent to Kafka");
            return true;
        } catch (err) {
            console.error("Error sending message to Kafka", err);
            return false;
        }
    }
}

export const initializeKafkaMQ = async (kafkaHost: string): Promise<KafkaMQ> => {
    const kafka = new Kafka({
        clientId: 'Campaign',
        brokers: [kafkaHost],
        logLevel: logLevel.INFO
    });

    const producer = kafka.producer();

    await producer.connect();
    console.log("Kafka producer is ready");
    const admin = kafka.admin();
    await admin.connect();

    try {
        const topics = await admin.listTopics();
        if (!topics.includes(config.KAFKA.KAFKA_TOPIC)) {
            await admin.createTopics({
                topics: [{ topic: config.KAFKA.KAFKA_TOPIC }]
            });
            console.log(`Topic ${config.KAFKA.KAFKA_TOPIC} created`);
        }
    } catch (error) {
        console.error("Error creating Kafka topics:", error);
    }

    await admin.disconnect();

    return new KafkaMQ(producer);
};