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
                eachBatch: async ({ batch, resolveOffset, heartbeat, commitOffsetsIfNecessary }) => {
                    try {
                        await Promise.all(batch.messages.map(async (message) => {
                            await workerFn({
                                topic: batch.topic,
                                partition: batch.partition,
                                message,
                                heartbeat,
                                pause: () => () => {},
                            });
                            resolveOffset(message.offset);
                        }));

                        if (!option?.autoCommit) {
                            await commitOffsetsIfNecessary();
                        }

                        await heartbeat();
                        console.log(`Processed batch of ${batch.messages.length} messages from ${batch.topic}`);

                    } catch (err) {
                        console.error("Error in batch:", err);
                    }
                }
            })
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