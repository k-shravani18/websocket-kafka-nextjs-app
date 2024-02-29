//kafkaMessages.tsx
//\src\app\components\KafkaMessages.tsx
"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function MyComponent() {
  console.log("my componet");

  const [messages, setMessages] = useState<string[]>([]); // Specify string[] as the type for messages
  useEffect(() => {
    console.log("after use effect and before connecting to the socket");
    const socket = io("http://localhost:3001");

    try {
      console.log("connection made");

      socket.on("kafka-message", (message: string) => {
        // Specify string as the type for the message
        setMessages((prevMessages: string[]) => [...prevMessages, message]);
        console.log("setting the message");
      });
    } catch (error) {
      console.error(error);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Kafka Messages</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
