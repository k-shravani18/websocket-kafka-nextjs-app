//\src\app\kafka\ConsumerFactory.ts

import {
  Consumer,
  ConsumerSubscribeTopics,
  Kafka,
  EachMessagePayload,
} from "kafkajs";
import { Server } from "socket.io";

export default class ConsumerFactory {
  
  private kafkaConsumer: Consumer;
  private io: Server;

  constructor( io: Server) {
    this.kafkaConsumer = this.createKafkaConsumer();
    this.io = io;
  }
  private messageQueue: string[] = []; // Queue to hold messages

  public async startConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: ["demo"],
      fromBeginning: true,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { message } = messagePayload;
          if (message && message.value !== null) {
            const messageValue = message.value.toString();
            console.log("Received message:", messageValue);
             // Add message to queue
          this.messageQueue.push(messageValue);
          // Emit messages if WebSocket server is available
          this.emitMessages();
          }
        },
      });
    } catch (error) {
      console.error("Error starting Kafka consumer:", error);
      throw error;
    }
  }

  private createKafkaConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: "demo",
      brokers: ["localhost:9092"],
    });
    return kafka.consumer({ groupId: "consumer-group" });
  }
  private emitMessages() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.io) {
        this.io.emit("kafka-message", message);
      }
    }
  }
}

