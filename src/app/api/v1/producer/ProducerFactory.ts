// import {
//   Kafka,
//   Message,
//   Producer,
//   ProducerBatch,
//   TopicMessages,
// } from "kafkajs";

// interface CustomMessageFormat {
//   a: string;
// }

// export default class ProducerFactory {
//   private producer: Producer;

//   constructor() {
//     this.producer = this.createProducer();
//   }

//   public async start(): Promise<void> {
//     try {
//       await this.producer.connect();
//     } catch (error) {
//       console.log("Error connecting the producer: ", error);
//     }
//   }

//   public async shutdown(): Promise<void> {
//     await this.producer.disconnect();
//   }

//   public async sendBatch(messages: Array<CustomMessageFormat>): Promise<void> {
//     console.log("entering into sendBatch ()");

//     const kafkaMessages: Array<Message> = messages.map((message) => {
//       console.log("==================");

//       return {
//         value: JSON.stringify(message),
//       };
//     });

//     const topicMessages: TopicMessages = {
//       topic: "demo",
//       messages: kafkaMessages,
//     };

//     const batch: ProducerBatch = {
//       topicMessages: [topicMessages],
//     };

//     await this.producer.sendBatch(batch);
//   }

//   private createProducer(): Producer {
//     const kafka = new Kafka({
//       clientId: "098673", // Use the provided client ID
//       brokers: ["192.168.30.29:9092"], // Update the broker IP address
//       ssl: false, // Enable SSL since you're connecting over the network
//       sasl: {
//         mechanism: "scram-sha-256", // Use plain SASL mechanism for authentication
//         username: "sandeepvm2", // Use the provided username
//         password: "Redhat@123", // Use the provided password
//       },
//     //   sasl: {
//     //     mechanism: 'gssapi', // Specify the mechanism directly here
//     //     servicePrincipal: 'kafka', // Specify the service principal here
//     //   },

//     // } as any);
//     });

//     return kafka.producer();
//   }
// }

import {
  Kafka,
  Message,
  Producer,
  ProducerBatch,
  TopicMessages,
} from "kafkajs";

interface CustomMessageFormat {
  a: string;
}

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
