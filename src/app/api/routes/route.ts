// src/api/routes/route.ts

import { NextApiRequest, NextApiResponse } from "next";
import { KafkaUtils } from "@/utils/KafkaUtils";
import ConsumerFactory from "../../../../kafka/ConsumerFactory";

export async function GET(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    // Access ConsumerFactory instance from KafkaUtils
    const consumerFactory: ConsumerFactory = KafkaUtils.getConsumerInstance("demo");

    // Retrieve messages from ConsumerFactory (ensure it returns messages)
    const messages = consumerFactory.getReceivedMessages();
    // Check if res is a valid NextApiResponse instance
    if (!res.status || !res.json) {
      throw new Error("Response object is not valid");
    }
    // Explicitly return the response using res.status and res.json
    return res.status(200).json(messages); // Success response

  } catch (error) {
    console.error("Error retrieving messages:", error);

    // Return an error response with appropriate status code
    return res.status(500).json({ error: "Failed to retrieve messages" });
  }
}