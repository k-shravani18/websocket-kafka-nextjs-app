//\app \src\server.ts

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
  const consumer = KafkaUtils.getConsumerInstance(io);
  // Start Kafka consumer
  try {
    await consumer.startConsumer();
    console.log("Consumer started successfully");
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
    return; // Exit function if consumer fails to start
  }
}
