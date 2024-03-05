// kafkaUtils.ts
import ProducerFactory from "@/app/kafka/ProducerFactory";
import ConsumerFactory from "@/app/kafka/ConsumerFactory";
import { Server } from "socket.io";

export class KafkaUtils {
  private static producerInstance: ProducerFactory | null = null;
  private static consumerInstance: ConsumerFactory | null = null;

  public static getProducerInstance(): ProducerFactory {
    if (!this.producerInstance) {
      this.producerInstance = new ProducerFactory();
    }
    return this.producerInstance;
  }

  public static getConsumerInstance(io: Server): ConsumerFactory {
    if (!this.consumerInstance) {
      this.consumerInstance = new ConsumerFactory(io);
    }
    return this.consumerInstance;
  } 
}
