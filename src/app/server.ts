// //server.ts
// // \src\app\api\v1\consumer\server.ts

// import { Server } from "socket.io";
// import { createServer } from "http";
// import ConsumerFactory, {
//   ExampleMessageProcessor,
// } from "./api/v1/consumer/ConsumerFactory";
// import ProducerFactory from "./api/v1/producer/ProducerFactory";
// import { error } from "console";

// /* producer.start().then(()=>{
// //   console.log("Producer started Successfully");
// // }).catch((error)=>{
// //   console.log("Failed to start Kafka producer:", error);
// // })

// // Set up HTTP server
// // export default function startServer() { */
// export default async function startServer() {
//   // Initialize Kafka producer
//   try {
//     const producer = new ProducerFactory();
//     await producer.start();
//     console.log("Producer started successfully");

//     // Send messages using the producer
//     const messages = [
//       { value: "message1" },
//       { value: "message2" },
//       { value: "message3" },
//     ];
//     const result = await producer.sendBatch(messages);
//     console.log("Message sent to Kafka:", result);
//   } catch (error) {
//     console.error("Failed to start Kafka producer:", error);
//   }

//   const httpServer = createServer();
//   const io = new Server(httpServer, {
//     cors: {
//       origin: "http://localhost:3000", // Allow connections from this origin
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Client connected");
//   });

//   // Start WebSocket server
//   httpServer.listen(3001, () => {
//     console.log("WebSocket server listening on port 3001");
//   });

//   // Initialize Kafka consumer and message processor
//   const messageProcessor: ExampleMessageProcessor = { a: "" };
//   const consumer = new ConsumerFactory(messageProcessor, io);

//   // Start Kafka consumer
//   consumer
//     .startConsumer()
//     .then(() => {
//       console.log("Consumer started successfully");
//     })
//     .catch((error) => {
//       console.error("Failed to start Kafka consumer:", error);
//     });
// }

 //server.ts
// // \src\app\api\v1\consumer\server.ts
import { Server } from "socket.io";
import { createServer } from "http";
import ConsumerFactory, {
  ExampleMessageProcessor,
} from "./api/v1/consumer/ConsumerFactory";
import ProducerFactory from "./api/v1/producer/ProducerFactory";
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
  try {
    const producer = new ProducerFactory();
    await producer.start();
    console.log("Producer started successfully");

    // Send messages using the producer
    const messages = [
      { value: "message1" },
      { value: "message2" },
      { value: "message3" },
    ];
    const result = await producer.sendBatch(messages);
    console.log("Message sent to Kafka:", result);
  } catch (error) {
    console.error("Failed to start Kafka producer:", error);
    return; // Exit function if producer fails to start
  }

  // Initialize Kafka consumer and message processor
  const messageProcessor: ExampleMessageProcessor = { a: "" };
  const consumer = new ConsumerFactory(messageProcessor, io);

  // Start Kafka consumer
  try {
    await consumer.startConsumer();
    console.log("Consumer started successfully");
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
    return; // Exit function if consumer fails to start
  }
}
