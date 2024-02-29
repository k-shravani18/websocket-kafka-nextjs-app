// //route.ts
// import ProducerFactory from "./ProducerFactory";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest, res: NextResponse) {
//   let producerFactory = new ProducerFactory();

//   try {
//     await producerFactory.start();
//     const messages = [{ a: "hello" }, { a: "" }];
//     const result = await producerFactory.sendBatch(messages);
//     // await producerFactory.shutdown();
//     console.log(">>>>>>>result>>>>>>>\n");
//     console.log(result);

//     return NextResponse.json({
//       message: "Message Sent to kafka topic", 
//       payloads: JSON.stringify(result),
//     });
//   } catch (error) {
//     console.error("Failed to produce Kafka messages:", error);
//     // res.status(500).json({ success: false, error: 'Failed to produce Kafka messages' });
//     return NextResponse.json({
//       message: "Failed to produce Kafka messages",
//       payloads: JSON.stringify("error occured"),
//     });
//   }
// }
