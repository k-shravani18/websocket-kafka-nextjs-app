// //\app \src\server.ts
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

//   // Start consumers and producer
//   const consumer1 = KafkaUtils.getConsumerInstance("demo", io);
//   const producer2 = KafkaUtils.getProducerInstance("create");
//   const consumer2 = KafkaUtils.getConsumerInstance("create", io);

//   try {
//     await Promise.all([
//       consumer1.startConsumer(),
//       producer2.start(),
//       consumer2.startConsumer(),
//     ]);
//     console.log("Consumers and producer started successfully");

//     // Send static messages for the "create" topic
//     const staticMessages = [
//       { value: "Static Message 1" },
//       { value: "Static Message 2" },
//     ];
//     await producer2.sendBatch(staticMessages);
//     console.log(
//       "Messages sent to Kafka: " +
//         staticMessages.map((msg) => msg.value).join(",")
//     );
//   } catch (error) {
//     console.error("Failed to start Kafka consumers and producer:", error);
//     return; // Exit function if any error occurs
//   }

//   // Listen for client connections
//   io.on("connection", (socket) => {
//     console.log("Client connected");

//     // Determine which consumer this socket should be associated with based on query parameter
//     const consumerType = socket.handshake.query.consumer;

//     // Handle each consumer separately
//     if (consumerType === "consumer1") {
//       console.log("Client connected to consumer1");
//       // Handle events specific to consumer1
//     } else if (consumerType === "consumer2") {
//       console.log("Client connected to consumer2");
//       // Handle events specific to consumer2
//     } else {
//       console.log("Unknown consumer type");
//       socket.disconnect();
//     }
//   });
// }

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

//   // Listen for client connections
//   await new Promise<void>((resolve) => {
//     io.on("connection", (socket) => {
//       console.log("Client connected");
//       resolve(); // Resolve the promise when client connects
//     });
//   });

//   const consumer1 = KafkaUtils.getConsumerInstance(
//     "demo",
//     io
//   );
//   const producer2 = KafkaUtils.getProducerInstance("create");
//   const consumer2 = KafkaUtils.getConsumerInstance("create", io);

//   // Define topics to consume from
//   const topics = ["demo", "create"];

//   // Get consumer instances for each topic
//   const consumers = topics.map((topic) =>
//     KafkaUtils.getConsumerInstance(topic, io)
//   );

//   try {
//     await Promise.all(consumers.map((consumer) => consumer.startConsumer()));
//     console.log("Consumers started successfully");
//   } catch (error) {
//     console.error("Failed to start Kafka consumers:", error);
//     return; // Exit function if consumers fail to start
//   }
// }
//*
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

  const consumer1 = KafkaUtils.getConsumerInstance("demo", io);
  console.log(consumer1 + " consumer 1");

  const producer2 = KafkaUtils.getProducerInstance("create");
  const consumer2 = KafkaUtils.getConsumerInstance("create", io);
  console.log(consumer2 + " consumer 2");

  // Start Kafka consumer
  try {
    await consumer1.startConsumer();
    console.log("Consumer1 started successfully");
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
    return; // Exit function if consumer fails to start
  }
  try {
    await producer2.start();
    console.log(
      "Producer2 started successfully without sending static messages"
    );
  } catch (error) {
    console.error("Failed to start producer 2:", error);
    return; // Exit function if producer fails to start
  }

  // await producer2.start();
  // // Send static messages for the "create" topic
  // const staticMessages = [
  //   { value: "Static Message 1" },
  //   { value: "Static Message 2" },
  // ];
  // await producer2.sendBatch(staticMessages);
  // console.log(
  //   "message sent to kafka : " +
  //     staticMessages.map((msg) => msg.value).join(",")
  // );

  console.log("consumer 2 started");

  try {
    await consumer2.startConsumer();
    console.log("Consumer2 started successfully");
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
    return; // Exit function if consumer fails to start
  }
  // Start consumers in parallel
  // await Promise.all([consumer1.startConsumer(), consumer2.startConsumer()]);
}
//**************************************************************************************************************************** */
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
