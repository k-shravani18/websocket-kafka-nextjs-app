// // src/utils/KafkaUtils.ts
// import { ProducerFactory } from "../app/kafka/ProducerFactory";
// import { ConsumerFactory } from "../app/kafka/ConsumerFactory";
// import { Server } from "socket.io";

// export class KafkaUtils {
//   private static producerInstance: ProducerFactory | null = null;
//   private static consumerInstance: ConsumerFactory | null = null;

//   public static getProducer(): ProducerFactory {
//     if (!KafkaUtils.producerInstance) {
//       KafkaUtils.producerInstance = new ProducerFactory();
//     }
//     return KafkaUtils.producerInstance;
//   }

//   public static getConsumer(io: Server): ConsumerFactory {
//     if (!KafkaUtils.consumerInstance) {
//       KafkaUtils.consumerInstance = new ConsumerFactory(io);
//     }
//     return KafkaUtils.consumerInstance;
//   }
// }
