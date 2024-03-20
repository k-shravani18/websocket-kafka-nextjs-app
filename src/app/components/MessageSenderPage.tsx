//src/app/components/MessageSenderPage.tsx

import React from "react";
import { KafkaUtils } from "@/utils/KafkaUtils";

async function sendMessage(formData: FormData) {
  "use server";

  const message = formData.get("message");

  // Check if message is not null before proceeding
  if (typeof message === "string") {
    const producer = KafkaUtils.getProducerInstance("demo");

    try {
      await producer.start();
      await producer.sendBatch([{ value: message }]);
      console.log("Message sent to Kafka:", message);
      await producer.shutdown();
    } catch (error) {
      console.error("Error sending message to Kafka:", error);
      throw new Error("Failed to send message to Kafka");
    }
  } else {
    console.error("Message is null or not a string:", message);
    throw new Error("Invalid message format");
  }
}

const MessageSenderPage = () => {
  return (
    <form action={sendMessage}>
      <input type="text" name="message" />
      <button type="submit">Send Message</button>
    </form>
  );
};

export default MessageSenderPage;
