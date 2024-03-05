//\src\app\kafka\ProducerFactory.ts
import {
  Kafka,
  Message,
  Producer,
  ProducerBatch,
  TopicMessages,
} from "kafkajs";

export default class ProducerFactory {
  private producer: Producer;
  constructor() {
    this.producer = this.createProducer();
  }
  public async start(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      console.log("Error connecting the producer: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }
  public async sendBatch(messages: { value: string }[]): Promise<void> {
    console.log("entering into sendBatch ()");
    const kafkaMessages: Array<Message> = messages.map((message) => {
      console.log("==================");
      return {
        // value: JSON.stringify(message)
        value: message.value, // Accessing the value property
      };
    });
    const topicMessages: TopicMessages = {
      topic: "demo",
      messages: kafkaMessages,
    };
    const batch: ProducerBatch = {
      topicMessages: [topicMessages],
    };
    await this.producer.sendBatch(batch);
  }
  private createProducer(): Producer {
    const kafka = new Kafka({
      clientId: "demo",
      brokers: ["localhost:9092"],
    });
    return kafka.producer();
  }
}
