//ConsumerFactory
//\src\app\api\v1\consumer\ConsumerFactory.ts
// import {
//     Consumer,
//     ConsumerSubscribeTopics,
//     EachBatchPayload,
//     Kafka,
//     EachMessagePayload,
//   } from "kafkajs";
//   import { Server } from "socket.io";

//   export interface ExampleMessageProcessor {
//     a: string;
//   }

//   export default class ConsumerFactory {
//     private kafkaConsumer: Consumer;
//     private messageProcessor: ExampleMessageProcessor;
//     private io: Server;

//     public constructor(messageProcessor: ExampleMessageProcessor, io: Server) {
//         this.messageProcessor = messageProcessor;
//         this.kafkaConsumer = this.createKafkaConsumer();
//         this.io = io;
//     }

//     public async startConsumer(): Promise<void> {
//         const topic: ConsumerSubscribeTopics = {
//             topics: ["demo"],
//             fromBeginning: true,
//         };

//         try {
//             await this.kafkaConsumer.connect();
//             await this.kafkaConsumer.subscribe(topic);

//             await this.kafkaConsumer.run({
//                 eachMessage: async (messagePayload: EachMessagePayload) => {
//                     const { message } = messagePayload;
//                     if (message && message.value !== null) {
//                         const messageValue = message.value.toString();
//                         console.log("Received message:", messageValue);
//                         // Emit the message via WebSocket to all clients
//                         this.io.emit("kafka-message", messageValue);
//                     }
//                 },
//             });
//         } catch (error) {
//             console.log("Error: ", error);
//         }
//     }

//     public async shutdown(): Promise<void> {
//         await this.kafkaConsumer.disconnect();
//     }

//     private createKafkaConsumer(): Consumer {
//         const kafka = new Kafka({
//             clientId: "demo",
//             brokers: ["localhost:9092"],
//         });
//         const consumer = kafka.consumer({ groupId: "consumer-group" });
//         return consumer;
//     }
//   }

//ConsumerFactory
//\src\app\api\v1\consumer\ConsumerFactory.ts
import {
  Consumer,
  ConsumerSubscribeTopics,
  Kafka,
  EachMessagePayload,
} from "kafkajs";
import { Server } from "socket.io";

export interface ExampleMessageProcessor {
  a: string;
}

export default class ConsumerFactory {
  
  private kafkaConsumer: Consumer;
  private messageProcessor: ExampleMessageProcessor;
  private io: Server;

  constructor(messageProcessor: ExampleMessageProcessor, io: Server) {
    this.messageProcessor = messageProcessor;
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
            // Emit the message via WebSocket to all clients
            // this.io.emit("kafka-message", messageValue);
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
