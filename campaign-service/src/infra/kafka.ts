import { KafkaClient, Producer, Consumer, Message } from "kafka-node";

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
        return new Promise((resolve, reject) => {
            const payloads = [{
                topic: topic,
                messages: message,
                key: option?.key,
                partition: option?.partition,
                timestamp: option?.timestamp,
                headers: option?.headers,
            }];

            this.kafkaProducer.send(payloads, (err, data) => {
                if (err) {
                    console.error("Error sending message to Kafka", err);
                    reject(false);
                }
                console.log("Message sent to Kafka", data);
                resolve(true);
            });
        });
    }
}

export const initializeKafkaMQ = async (kafkaHost: string): Promise<KafkaMQ> => {
    const client = new KafkaClient({ kafkaHost: kafkaHost });

    const producer = new Producer(client);

    producer.on("ready", () => {
        console.log("Kafka producer is ready");
    });

    return new KafkaMQ(producer);
};