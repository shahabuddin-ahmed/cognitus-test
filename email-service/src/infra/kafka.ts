import { Kafka, Consumer, EachMessagePayload } from "kafkajs";

export interface KafkaMQInterface {
    consumeFromTopic(topic: string, workerFn: (message: EachMessagePayload) => any, option?: { autoCommit: boolean }): void;
}

export class KafkaMQ implements KafkaMQInterface {

    constructor(private consumer: Consumer) {
        this.consumer = consumer;
    }

    public async consumeFromTopic(topic: string, workerFn: (message: EachMessagePayload) => any, option?: { autoCommit: boolean }): Promise<void> {
        try {
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                    try {
                        await workerFn({
                            topic, partition, message,
                            heartbeat: function (): Promise<void> {
                                throw new Error("Function not implemented.");
                            },
                            pause: function (): () => void {
                                throw new Error("Function not implemented.");
                            }
                        });

                        console.log(`Processed message: ${message.value?.toString()} from topic: ${topic}, partition: ${partition}`);
                        
                        if (option?.autoCommit) {
                            await this.consumer.commitOffsets([
                                {
                                    topic,
                                    partition,
                                    offset: (parseInt(message.offset, 10) + 1).toString(),
                                },
                            ]);
                            console.log(`Committed offset ${message.offset} for partition ${partition}`);
                        }
                    } catch (err) {
                        console.error("Error processing message:", err);
                    }
                },
            });
        } catch (err) {
            console.error("Error consuming from Kafka topic:", err);
        }
    }
}

export const initializeKafkaMQ = async (kafkaHost: string, groupId: string, topic: string): Promise<KafkaMQ> => {
    try {
        const kafka = new Kafka({
            clientId: "Campaign",
            brokers: [kafkaHost],
        });
        console.log("Connected to Kafka server");

        const kafkaConsumer = kafka.consumer({ groupId: "email-consumer-group" });
        await kafkaConsumer.connect();
        console.log("Kafka consumer connected");

         await kafkaConsumer.subscribe({ topic, fromBeginning: true });
        console.log(`Connected to Kafka and consuming messages from topic: ${topic}`);

        return new KafkaMQ(kafkaConsumer);
    } catch (err) {
        console.error("Failed to connect to Kafka", err);
        process.exit(1);
    }
};