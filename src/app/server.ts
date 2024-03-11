// //\app \src\server.ts

import { createServer } from "http";
import { Server } from "socket.io";
import { KafkaUtils } from "@/utils/KafkaUtils";

export default async function startServer() {
  // Initialize WebSocket server
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000", // Allow connections from this origin
      methods: ["GET", "POST"],
    },
  });

  // Start WebSocket server
  httpServer.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");
  });

  // Listen for client connections
  await new Promise<void>((resolve) => {
    io.on("connection", (socket) => {
      console.log("Client connected");
      resolve(); // Resolve the promise when client connects
    });
  });

  // Initialize Kafka producer
  // const producer = KafkaUtils.getProducerInstance();
  // await producer.start();

  // Initialize Kafka consumer
  // const consumer = KafkaUtils.getConsumerInstance(io);
  // const producer1 = KafkaUtils.getProducerInstance("demo");
  const consumer1 = KafkaUtils.getConsumerInstance("demo", io);

  // const producer2 = KafkaUtils.getProducerInstance("create");
  // const consumer2 = KafkaUtils.getConsumerInstance("create", io);

  // Start Kafka consumer
  try {
    await consumer1.startConsumer();
    console.log("Consumer started successfully");
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
    return; // Exit function if consumer fails to start
  }

  // await producer2.start();
  // Send static messages for the "create" topic
  // const staticMessages = [
  //   { value: "Static Message 1" },
  //   { value: "Static Message 2" },
  //   { value: "Static Message 3" },
  //   { value: "Static Message 3" } 
  // ];
  // await producer2.sendBatch(staticMessages);
  // console.log("consumer 2 started");
  
  // await consumer2.startConsumer();
  

  
}
// import { createServer } from "http";
// import { Server } from "socket.io";
// import { KafkaUtils } from "@/utils/KafkaUtils";

// export default async function startServer() {
//   // Initialize WebSocket server
//   const httpServer = createServer();
//   const io = new Server(httpServer, {
//     cors: {
//       origin: "http://localhost:3000", // Allow connections from this origin
//       methods: ["GET", "POST"],
//     },
//   });

//   // Start WebSocket server
//   httpServer.listen(3001, () => {
//     console.log("WebSocket server listening on port 3001");
//   });

//   // Initialize Kafka producer
//   // const producer = KafkaUtils.getProducerInstance();
//   // await producer.start();

//   // Initialize Kafka consumers
//   const consumer1 = KafkaUtils.getConsumerInstance("demo", io);
//   const consumer2 = KafkaUtils.getConsumerInstance("create", io);

//   // Start Kafka consumers
//   try {
//     await Promise.all([consumer1.startConsumer(), consumer2.startConsumer()]);
//     console.log("Consumers started successfully");
//   } catch (error) {
//     console.error("Failed to start Kafka consumers:", error);
//     return; // Exit function if consumers fail to start
//   }

//   // Listen for client connections
//   await new Promise<void>((resolve) => {
//     io.on("connection", (socket) => {
//       console.log("Client connected");
//       // Resolve the promise after a short delay to ensure consumers are ready
//       setTimeout(() => {
//         resolve();
//       }, 1000); // Adjust the delay as needed
//     });
//   });

//   // Send static messages for the "create" topic
//   const producer2 = KafkaUtils.getProducerInstance("create");
//   await producer2.start();
//   const staticMessages = [
//     { value: "Static Message 1" },
//     { value: "Static Message 2" },
//     // Add more static messages as needed
//   ];
//   await producer2.sendBatch(staticMessages);
//   console.log("Static messages sent for consumer 2");
// }