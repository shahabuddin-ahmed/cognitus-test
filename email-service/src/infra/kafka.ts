import { KafkaClient, Producer, Consumer, Message } from "kafka-node";

export interface KafkaMQInterface {
    consumeFromTopic(topic: string, callback: (message: Message) => void): void;
}

export class KafkaMQ implements KafkaMQInterface {
    private kafkaConsumer: Consumer;

    constructor(private kafkaClient: KafkaClient, private topic: string) {
        this.kafkaConsumer = new Consumer(kafkaClient, [{ topic: topic, partition: 0 }], { autoCommit: true }); // Initialize consumer
    }

    public consumeFromTopic(topic: string, callback: (message: Message) => void): void {
        this.kafkaConsumer.on("message", (message: Message) => {
            if (message.topic === topic) {
                callback(message);
            }
        });

        this.kafkaConsumer.on("error", (err) => {
            console.error("Error in Kafka Consumer:", err);
        });
    }
}

export const initializeKafkaMQ = async (kafkaHost: string, topic: string): Promise<KafkaMQ> => {
    try {
        const client = new KafkaClient({ kafkaHost: kafkaHost });
        console.log("Connected to Kafka server");

        return new KafkaMQ(client, topic);
    } catch (err) {
        console.error("Failed to connect to Kafka", err);
        process.exit(1);
    }
};