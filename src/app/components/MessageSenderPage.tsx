//src/app/components/messageSender.tsx

import React from "react";
import ProducerFactory from "../kafka/ProducerFactory";

async function sendMessage(formData: FormData) {
  "use server";

  const message = formData.get("message");

  // Check if message is not null before proceeding
  if (typeof message === "string") {
    const message_producer = new ProducerFactory();

    try {
      await message_producer.start();
      await message_producer.sendBatch([{ value: message }]);
      console.log("Message sent to Kafka:", message);
      await message_producer.shutdown();
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

// src/app/components/MessageSenderPage.tsx
// import React from "react";
// import { KafkaUtils } from "../../utils/KafkaUtils";

// async function sendMessage(formData: FormData) {
//   const message = formData.get("message");

//   if (typeof message === "string") {
//     const producer = KafkaUtils.getProducer();

//     try {
//       await producer.start();
//       await producer.sendBatch([{ value: message }]);
//       console.log("Message sent to Kafka:", message);
//     } catch (error) {
//       console.error("Error sending message to Kafka:", error);
//       throw new Error("Failed to send message to Kafka");
//     }
//   } else {
//     console.error("Message is null or not a string:", message);
//     throw new Error("Invalid message format");
//   }
// }

// const MessageSenderPage = () => {
//   return (
//     <form onSubmit={(e) => {
//       e.preventDefault();
//       sendMessage(new FormData(e.target as HTMLFormElement));
//     }}>
//       <input type="text" name="message" />
//       <button type="submit">Send Message</button>
//     </form>
//   );
// };

// export default MessageSenderPage;

