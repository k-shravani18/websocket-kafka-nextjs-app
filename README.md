# Real-Time Message Display(WS) with Kafka Integration and Next.js 14.1.3

### 1. Overview

The objective of this project is to create a web application that demonstrates real-time message display without the need for page refresh. We aim to achieve this by integrating Kafka for message processing and WebSocket.io for real-time communication between the server and client-side web page.

#### Key Features:

**Real-Time Message Display:** Messages produced by Kafka integration will be dynamically rendered on the webpage in real-time, providing users with instant updates without manual page refresh.
**Interactive Message Input:** A form component will be developed to allow users to input messages. Upon submission, these messages will be produced to a Kafka topic and subsequently displayed on the webpage alongside previously received messages.

### Goals:

**Integration of Kafka with Next.js:** Implement Kafka integration within the Next.js application to enable message production and consumption.
**Real-Time Message Display:** Utilize WebSocket.io to establish real-time communication between the server and client-side web page, ensuring that messages are displayed instantly without page refresh.
**Dynamic Message Production:** Develop a form component responsible for gathering user input messages, which are then produced to a Kafka topic by the producer component. These messages are then consumed and displayed on the webpage in real-time.

### 2. Setting Up a Next.js Project

#### Installation and Dependency Management

This Next.js application is built using TypeScript and AppRouter for navigation.

To set up a Next.js project, you can use the following command:

```
npx create-next-app@latest
```

During the installation process, you'll be prompted with several options:

- Project Name: Choose a name for your project.
- TypeScript: Decide whether to use TypeScript. (YES)
- ESLint: Choose whether to use ESLint.
- Tailwind CSS: Decide whether to use Tailwind CSS.
- src/ Directory: Choose whether to use the src/ directory.(YES)
- App Router: Decide whether to use the App Router.(YES)
- Import Alias: Choose whether to customize the default import alias.

**Dependencies:**
To integrate Kafka and Websocket functionality into Next.js project, here we need to install the following dependencies:

- kafkajs
- cors
- socket.io
- socket.io-client

**kafkajs :**
KafkaJS is a client library for Apache Kafka written in JavaScript. It allows your application to interact with Apache Kafka clusters, enabling real-time data processing and streaming.

```
npm install kafkajs
```

**cors :**
CORS (Cross-Origin Resource Sharing) is a security feature that restricts cross-origin HTTP requests. It's commonly used in web applications to control access to resources from different origins.

```
npm install cors
```

**socket.io:**
Socket.IO is a JavaScript library for real-time web applications. It enables bidirectional communication between clients and servers, making it suitable for implementing Websocket functionality in this project.

```
npm install socket.io
```

**socket.io-client :**
This is the client-side component of Socket.IO. It allows your client-side code to establish and maintain a WebSocket connection with the server.

```
npm install socket.io-client
```

\\
Kafka Setup
Install Kafka and execute the following commands:

# Start Zookeeper

.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties

# Start Kafka Server

.\bin\windows\kafka-server-start.bat .\config\server.properties

# Create Kafka Topic

.\bin\windows\kafka-topics.bat --create --bootstrap-server localhost:9092 --topic demo

# Start producer

.\bin\windows\kafka-console-producer.bat --bootstrap-server localhost:9092 --topic demo

# Start Consumer

.\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic demo --from-beginning

1.Integrate kafka with next js , through next js messages should produce and consume:
Create a next js project ,install kafka js

1.using postman api :

// ProducerFactory.ts
// ConsumerFactory.ts
// Server.ts
// Page.tsx
// KafkaMessages.tsx

ProducerFactory:
import { Kafka, Message, Producer, ProducerBatch, TopicMessages } from 'kafkajs'
interface CustomMessageFormat { a: string }
export default class ProducerFactory {
private producer: Producer
constructor() {
this.producer = this.createProducer()
}
public async start(): Promise<void> {
try {
await this.producer.connect()
} catch (error) {
console.log('Error connecting the producer: ', error)
}
}

public async shutdown(): Promise<void> {
await this.producer.disconnect()
}
public async sendBatch(messages: Array<CustomMessageFormat>): Promise<void> {
console.log('entering into sendBatch ()');
const kafkaMessages: Array<Message> = messages.map((message) => {
console.log('==================');
return {
value: JSON.stringify(message)
}
})
const topicMessages: TopicMessages = {
topic: 'create',
messages: kafkaMessages
}
const batch: ProducerBatch = {
topicMessages: [topicMessages]
}
await this.producer.sendBatch(batch)
}
private createProducer() : Producer {
const kafka = new Kafka({
clientId: 'create',
brokers: ['localhost:9092'],
})
return kafka.producer()
}
}

producer/route.ts:
import { NextApiRequest, NextApiResponse } from "next";
import ProducerFactory from "./ProducerFactory";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
let producerFactory = new ProducerFactory();

try {
await producerFactory.start();
const messages = [{ a: "hello" }, { a: "everyone" }];
const result = await producerFactory.sendBatch(messages);
// await producerFactory.shutdown();
console.log(">>>>>>>result>>>>>>>\n");
console.log(result);

    return NextResponse.json({
      message: "Message Sent to kafka topic",
      payloads: JSON.stringify(result),
    });

} catch (error) {
console.error("Failed to produce Kafka messages:", error);
// res.status(500).json({ success: false, error: 'Failed to produce Kafka messages' });
return NextResponse.json({
message: "Failed to produce Kafka messages",
payloads: JSON.stringify("error occured"),
});
}
}
ConsumerFactory.ts:
import {
Consumer,
ConsumerSubscribeTopics,
EachBatchPayload,
Kafka,
EachMessagePayload,
LogEntry
} from "kafkajs";

export interface ExampleMessageProcessor {
a: string;
}

export default class ConsumerFactory {
private kafkaConsumer: Consumer;
private messageProcessor: ExampleMessageProcessor;

public constructor(messageProcessor: ExampleMessageProcessor) {
this.messageProcessor = messageProcessor;
this.kafkaConsumer = this.createKafkaConsumer();
}

public async startConsumer(): Promise<void> {

    const topic: ConsumerSubscribeTopics = {
      topics: ["demo"],
      fromBeginning: true,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { message } = messagePayload;
          if (message && message.value !== null) {
            const messageValue = message.value.toString(); // Convert message value to string
            console.log("Received message:", messageValue);
            // const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
            // console.log(`- ${prefix} ${message.key}#${message.value}`);
          }
        },
      });
    } catch (error) {
      console.log("Error: ", error);
    }

}

public async startBatchConsumer(): Promise<void> {
const topic: ConsumerSubscribeTopics = {
topics: ["demo"],
fromBeginning: false,
};

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);
      await this.kafkaConsumer.run({
        eachBatch: async (eachBatchPayload: EachBatchPayload) => {
          const { batch } = eachBatchPayload;
          for (const message of batch.messages) {
            const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`;
            console.log(`- ${prefix} ${message.key}#${message.value}`);
          }
        },
      });
    } catch (error) {
      console.log("Error: ", error);
    }

}

public async shutdown(): Promise<void> {
await this.kafkaConsumer.disconnect();
}

private createKafkaConsumer(): Consumer {
const kafka = new Kafka({
clientId: "demo",
brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "consumer-group" });
return consumer;
}
}

consumer/route.ts:
// route.ts
import { NextRequest, NextResponse } from "next/server";
import ConsumerFactory, { ExampleMessageProcessor } from "./ConsumerFactory";

const messageProcessor: ExampleMessageProcessor = { a: "" };

export async function GET(req: NextRequest, res: NextResponse) {
let consumer = new ConsumerFactory(messageProcessor);
let messages: any[] = [];

try {
await consumer.startConsumer();
console.log("Consumer started successfully");

    // Wait for a few seconds to receive messages
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Stop the consumer
    await consumer.shutdown();

    // Return the messages in the response
    return NextResponse.json({
      message: "Messages received from Kafka topic",
      payloads: messages,
    });

} catch (error) {
console.error("Failed to receive Kafka messages:", error);
return NextResponse.json({
message: "Failed to receive Kafka messages",
payloads: "error occurred",
});
}
}

2. Without using postman autoconfigure kafka when next js app runs:
   // ConsumerFactory.ts
   // KafkaMessages.tsx
   // Server.ts
   // Page.tsx
   // MessageSenderPage.tsx

consumerFactory:
import {
Consumer,
ConsumerSubscribeTopics,
Kafka,
EachMessagePayload,
} from "kafkajs";
import { Server } from "socket.io";

export interface ExampleMessageProcessor {
a: string;
}

export default class ConsumerFactory {
private kafkaConsumer: Consumer;
private messageProcessor: ExampleMessageProcessor;
private io: Server;

constructor(messageProcessor: ExampleMessageProcessor, io: Server) {
this.messageProcessor = messageProcessor;
this.kafkaConsumer = this.createKafkaConsumer();
this.io = io;
}

public async startConsumer(): Promise<void> {
const topic: ConsumerSubscribeTopics = {
topics: ["demo"],
fromBeginning: true,
};

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);


      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { message } = messagePayload;
          if (message && message.value !== null) {
            const messageValue = message.value.toString();
            console.log("Received message:", messageValue);
            // Emit the message via WebSocket to all clients
            this.io.emit("kafka-message", messageValue);
          }
        },
      });
    } catch (error) {
      console.error("Error starting Kafka consumer:", error);
      throw error;
    }

}

private createKafkaConsumer(): Consumer {
const kafka = new Kafka({
clientId: "demo",
brokers: ["localhost:9092"],
});
return kafka.consumer({ groupId: "consumer-group" });
}
}

KafkaMessages.tsx
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

Server.ts:
//server.ts
import { Server } from "socket.io";
import { createServer } from "http";
import ConsumerFactory, {
ExampleMessageProcessor,
} from "./api/v1/consumer/ConsumerFactory";

// Set up HTTP server
// export default function startServer() {
export default function startServer() {
const httpServer = createServer();
const io = new Server(httpServer, {
cors: {
origin: "http://localhost:3000", // Allow connections from this origin
methods: ["GET", "POST"],
},
});

io.on("connection", (socket) => {
console.log("Client connected");
});

// Start WebSocket server
httpServer.listen(3001, () => {
console.log("WebSocket server listening on port 3001");
});

// Initialize Kafka consumer and message processor
const messageProcessor: ExampleMessageProcessor = { a: "" };
const consumer = new ConsumerFactory(messageProcessor, io);

// Start Kafka consumer
consumer
.startConsumer()
.then(() => {
console.log("Consumer started successfully");
// (window as any).location.href = "/home";
})
.catch((error) => {
console.error("Failed to start Kafka consumer:", error);
});
}

Page.tsx:
import React, { useEffect } from "react";
import MyComponent from "./components/KafkaMessages";
import startServer from "./server";

const home = () => {
startServer()
return (
<div>
<MyComponent />
</div>
);
};

export default home;

2.No HTTP methods exported in 'C:\Users\HP\VSworkspace\nextjs\ws\ws-app\src\app\route.ts'. Export a named export for each HTTP method.
( No HTTP methods exported in 'C:\Users\HP\VSworkspace\nextjs\ws\ws-app\src\app\route.ts'. Export a named export for each HTTP method.  
)
sol=> THIS error solved by changing the file name from route.ts to something else(server.ts) because inbuilt ly route.ts handle or expects handlers like GET,PUT,POST… so i’m not using here for routing purpose , using for server connection so by changing the file name it is runnng.

2.{"level":"ERROR","timestamp":"2024-02-28T06:03:32.032Z","logger":"kafkajs","message":"[Connection] Response Metadata(key: 3, version: 6)","broker":"localhost:9092","clientId":"create","error":"There is no leader for this topic-partition as we are in the middle of a leadership election","correlationId":1,"size":86}
{"level":"ERROR","timestamp":"2024-02-28T06:03:32.374Z","logger":"kafkajs","message":"[Connection] Response Metadata(key: 3, version: 6)","broker":"localhost:9092","clientId":"create","error":"There is no leader for this topic-partition as we are in the middle of a leadersh

Solved:
3.the issue lies in the timing of events. The messages are being received by the consumer before the client connects to the WebSocket server. Therefore, the messages received before the client connection is established are not displayed on the webpage.
Sol:
To resolve this issue, you need to ensure that the consumer starts processing messages only after the client has successfully connected to the WebSocket server. You can achieve this by waiting for the WebSocket connection event before starting the consumer.
Sol 2:
want to ensure that the WebSocket server waits for consumer messages before attempting to emit them to clients.

3.ip address:
error:”Error: Client network socket disconnected before secure TLS connection was established\n at connResetException’
sal=false
->"error":"Request is not valid given the current SASL state","correlationId":1,"size":10}&
Error connecting the producer: KafkaJSProtocolError: Request is not valid given the current SASL state
->SASL authentication handshake between your Kafka producer and the broker.
->Error connecting the producer: KafkaJSProtocolError: Request is not valid given the current SASL state
sol: the VM kafka server is not running

4.error:
⨯ node_modules\next\dist\client\router.js (146:14) @ useRouter
⨯ Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted
at MessageSenderPage (./src/app/components/messageSenderPage.tsx:15:74)
null
Sol: import useRouter instead of next/router use next/navigation

5.error:
POST http://localhost:3000/app/api/send-message-api 404 (Not Found
sol:An API Route should be in a file called route.js. Meaning app/api/admin/all.js should be app/api/admin/route.js, with the corresponding URL being /api/admin. Also, the functions inside should use a specific definition:
export async function GET(request) {}
GET can be replaced with POST, PUT, PATCH
sol:The api route name should be as route.ts only if we give othervnames it will not work as route api so inside route.ts we should use functions as GET,POST, PUT, PATCH.

6.error: Detected default export in 'C:\Users\HP\VSworkspace\nextjs\ws\ws-app\src\app\api\sendapi\route.ts'. Export a named export for each HTTP method instead.
⨯ No HTTP methods exported in 'C:\Users\HP\VSworkspace\nextjs\ws\ws-app\src\app\api\sendapi\route.ts'. Export a named export for each HTTP method.

/src/api/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import ProducerFactory from "../../kafka/ProducerFactory";
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
if (req.method === "POST") {
try {
const { message } = req.body;
const producer = new ProducerFactory();
await producer.start();
await producer.sendBatch([{ value: message }]);
producer.shutdown();
res.status(200).json({ success: true });
} catch (error) {
console.error("failed to send message ", error);
res.status(500).json({ success: false, error: "failed to send message" });
}
} else {
res.status(405).json({ success: false, error: "method not allowed" });
}
}

sol: we should not keep default for api handlers like get ,put,delete,post etc.

//src/app/components/messageSender.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";

const MessageSenderPage = () => {
const router = useRouter();
const [message, setMessage] = useState("");

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();
try {
await fetch("/api/sendapi", {
method: "POST",
headers: {
"Content-Type": "applicaton/json",
},
body: JSON.stringify({ message }),
});
setMessage("");
router.push("/");
} catch (error) {
console.error("failed to send message ", error);
}
};
const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
setMessage(event.target.value);
};
return (
<div>
<h1>Send Messages</h1>
<form onSubmit={handleSubmit}>
<input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="enter message"
        />
<button type="submit">'submit'</button>
</form>
</div>
);
};
export default MessageSenderPage;

Sol:so fetching api routes from app routers are not working properly. so use "user server" in afunction level then that function can deak with server in clent component

Error: default export in your root page ("/") is not a valid React component.
sol:To resolve this, you need to ensure that the default export in your root page file is indeed a React component.
incode, it seems that your root page ("/") is named home, and it's defined as a function. However, it's not returning any JSX, which is necessary for it to be a valid React component.
To fix the issue, you need to modify your home function to return JSX representing your root page.
Add this “export default Home;”
=> need to use Server Actions to handle form submissions and data mutations in your Next.js application.
MessageSenderPage.tsx

import React from "react";
import ProducerFactory from "../kafka/ProducerFactory";

async function sendMessage(formData: FormData) {
'use server';

const message = formData.get('message');
const producer = new ProducerFactory();

try {
await producer.start();
await producer.sendBatch([{ value: message }]);
console.log("Message sent to Kafka:", message);
await producer.shutdown();
} catch (error) {
console.error("Error sending message to Kafka:", error);
throw new Error("Failed to send message to Kafka");
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

page.tsx
jsx
Copy code
import React from "react";
import MessageSenderPage from "./components/MessageSenderPage";

// Server Component
export default async function Page() {
return (

 <div>
 <MessageSenderPage />
 {/* Other components */}
 </div>
 );
}

In this code:
sendMessage function is marked as a Server Action using the 'use server' directive.
The MessageSenderPage component contains a form with an action attribute set to the sendMessage function. This ensures that when the form is submitted, the sendMessage function is invoked.
The Page component is marked as a Server Component using the async keyword. This allows it to contain Server Actions.
When the Page component is rendered, it includes the MessageSenderPage component, which can now handle form submissions using Server Actions.

—--------------------------------------------------------------------------------------------------

Explanation:
WebSocket Connections:
WebSocket is a communication protocol that provides full-duplex communication channels over a single TCP connection.
WebSocket allows for persistent, bi-directional communication between a client (usually a web browser) and a server.
WebSocket Client Connection:
The WebSocket client is typically a web browser or any client-side application that establishes a connection to a WebSocket server.
In your scenario, the WebSocket client is implemented in the React component KafkaMessages.tsx. It uses the socket.io-client library to establish a connection to the WebSocket server.
The WebSocket client initiates the connection by sending a WebSocket handshake request to the WebSocket server.
WebSocket Server Connection:
The WebSocket server is responsible for handling WebSocket connections from clients, managing those connections, and facilitating communication between clients.
In your scenario, the WebSocket server is implemented using Socket.IO and runs on port 3001. It listens for incoming WebSocket connections from clients.
When a WebSocket client attempts to connect, the WebSocket server accepts the connection and maintains a persistent connection with the client.
The WebSocket server can broadcast messages to all connected clients or send messages to specific clients.
Kafka Producer and Consumer Servers:
Kafka is a distributed streaming platform that allows producers to publish records/messages to Kafka topics and consumers to subscribe to those topics and process the messages.
In your scenario, you have Kafka producer and consumer servers implemented using the kafkajs library.
The Kafka producer server is responsible for producing messages and sending them to Kafka topics.
The Kafka consumer server is responsible for consuming messages from Kafka topics and processing them.
Relations:
The WebSocket server and the Kafka producer/consumer servers are separate entities with distinct responsibilities.
The WebSocket server and the Kafka servers may run on different machines or the same machine but on different ports.
The WebSocket server acts as an intermediary between WebSocket clients and Kafka servers. It receives messages from Kafka consumers and broadcasts them to connected WebSocket clients.
WebSocket clients connect to the WebSocket server to receive real-time updates or messages from Kafka topics.
The Kafka producer server produces messages and sends them to Kafka topics.
The Kafka consumer server consumes messages from Kafka topics and, in your case, emits them to the WebSocket server for broadcasting to WebSocket clients.
============================================================
/\*
The provided code might have a subtle concurrency issue that could be causing only the first-mentioned consumer's messages to be displayed on the webpage. Here's the potential problem and solution:
Issue:
The line const io = new Server(httpServer, { ... }); creates a single instance of the WebSocket server. This server can only handle one connection at a time by default. If both consumers (especially consumer2) try to emit messages to the same WebSocket client concurrently, the second message might be overwritten or lost before the client receives it.
Solution:
To ensure both consumers can send messages simultaneously, create a separate WebSocket instance for each consumer. Update the code as follows:
JavaScript
// Inside startServer function:
const io1 = new Server(httpServer, { cors: { ... } }); // Server for consumer1
const io2 = new Server(httpServer, { cors: { ... } }); // Server for consumer2

// ... rest of the code

// Update consumer instances to use their respective servers
const consumer1 = KafkaUtils.getConsumerInstance("demo", io1);
const consumer2 = KafkaUtils.getConsumerInstance("create", io2);

// ... rest of the code

Use code with caution.
content_copy
Explanation:
By creating two separate WebSocket servers (io1 and io2), each consumer can connect to its dedicated server and emit messages without interference. The client will then receive messages from both consumers through their respective servers.
Additional Tips:
Ensure the client can handle receiving messages from multiple sources (e.g., by using appropriate WebSocket libraries).
Consider implementing message queuing on the client-side (if necessary) to handle potential message spikes from both consumers.
By implementing this solution and considering the additional tips, you should be able to receive and display messages from both consumers on the webpage successfully.
\*/

“// src/api/routes/route.ts

err:

### ABC-ops-comply master

**_ Error _**
{"level":"ERROR","timestamp":"2024-03-13T05:48:47.506Z","logger":"kafkajs","message":"[Connection] Connection timeout","broker":"192.168.30.29:9092","clientId":"demo"}
{"level":"ERROR","timestamp":"2024-03-13T05:48:47.512Z","logger":"kafkajs","message":"[BrokerPool] Failed to connect to seed broker, trying another broker from the list: Connection timeout","retryCount":0,"retryTime":341}
{"level":"ERROR","timestamp":"2024-03-13T05:48:47.515Z","logger":"kafkajs","message":"[Connection] Connection error: read ECONNRESET","broker":"192.168.30.29:9092","clientId":"demo","stack":"Error: read ECONNRESET\n at TLSWrap.onStreamRead (node:internal/stream_base_commons:217:20)\n at TLSWrap.callbackTrampoline (node:internal/async_hooks:130:17)"}
✓ Compiled /api/v2/getRealms in 2.2s (938 modules)
{"level":"ERROR","timestamp":"2024-03-13T05:48:48.334Z","logger":"kafkajs","message":"[Connection] Connection error: Client network socket disconnected before secure TLS connection was established","broker":"192.168.30.29:9092","clientId":"demo","stack":"Error: Client network socket disconnected before secure TLS connection was established\n at connResetException (node:internal/errors:720:14)\n at TLSSocket.onConnectEnd (node:\_tls_wrap:1605:19)\n at TLSSocket.emit (node:events:526:35)\n at endReadableNT (node:internal/streams/readable:1359:12)\n at process.processTicksAndRejections (node:internal/process/task_queues:82:21)"}
{"level":"ERROR","timestamp":"2024-03-13T05:48:48.338Z","logger":"kafkajs","message":"[BrokerPool] Failed to connect to seed broker, trying another broker from the list: Connection error: Client network socket disconnected before secure TLS connection was established","retryCount":1,"retryTime":604}
AxiosError: getaddrinfo ENOTFOUND sso-dev-k8s.adityabirla.com
**_Error_**

(node:17832) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
(Use `node --trace-warnings ...` to show where the warning was created)
✓ Ready in 5.6s
○ Compiling / ...
✓ Compiled / in 6.6s (1162 modules)
WebSocket server listening on port 3001
my componet
✓ Compiled in 1855ms (322 modules)
{"level":"WARN","timestamp":"2024-03-14T06:59:18.599Z","logger":"kafkajs","message":"KafkaJS v2.0.0 switched default partitioner. To retain the same partitioning behavior as in previous versions, create the producer with the option \"createPartitioner: Partitioners.LegacyPartitioner\". See the migration guide at https://kafka.js.org/docs/migration-guide-v2.0.0#producer-new-default-partitioner for details. Silence this warning by setting the environment variable \"KAFKAJS_NO_PARTITIONER_WARNING=1\""}
{"level":"ERROR","timestamp":"2024-03-14T06:59:18.971Z","logger":"kafkajs","message":"[Connection] Response SaslHandshake(key: 17, version: 1)","broker":"192.168.30.29:9092","clientId":"098673","error":"Request is not valid given the current SASL state","correlationId":1,"size":10}
{"level":"ERROR","timestamp":"2024-03-14T06:59:18.974Z","logger":"kafkajs","message":"[BrokerPool] Failed to connect to seed broker, trying another broker from the list: Request is not valid given the current SASL state","retryCount":0,"retryTime":333}
Error connecting the producer: KafkaJSProtocolError: Request is not valid given the current SASL state
at createErrorFromCode (webpack-internal:///(rsc)/./node_modules/kafkajs/src/protocol/error.js:581:10)
at Object.parse (webpack-internal:///(rsc)/./node_modules/kafkajs/src/protocol/requests/saslHandshake/v0/response.js:24:11)
at Connection.send (webpack-internal:///(rsc)/./node_modules/kafkajs/src/network/connection.js:433:35)
at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
at async SASLAuthenticator.authenticate (webpack-internal:///(rsc)/./node_modules/kafkajs/src/broker/saslAuthenticator/index.js:35:23)
at async eval (webpack-internal:///(rsc)/./node_modules/kafkajs/src/network/connection.js:139:9)
at async Connection.authenticate (webpack-internal:///(rsc)/./node_modules/kafkajs/src/network/connection.js:315:5)
at async Broker.connect (webpack-internal:///(rsc)/./node_modules/kafkajs/src/broker/index.js:111:7)
at async eval (webpack-internal:///(rsc)/./node_modules/kafkajs/src/cluster/brokerPool.js:93:9)
at async eval (webpack-internal:///(rsc)/./node_modules/kafkajs/src/cluster/index.js:107:14)
at async Cluster.connect (webpack-internal:///(rsc)/./node_modules/kafkajs/src/cluster/index.js:146:5)
at async Object.connect (webpack-internal:///(rsc)/./node_modules/kafkajs/src/producer/index.js:219:7)
at async ProducerFactory.start (webpack-internal:///(rsc)/./kafka/ProducerFactory.ts:16:13)
at async $$ACTION_0 (webpack-internal:///(rsc)/./src/component/MessageSenderPage.tsx:27:13)
at async C:\Users\HP\VSworkspace\nextjs\31_01_2024_abg_feature_dev\cpm\node_modules\next\dist\compiled\next-server\app-page.runtime.dev.js:38:7068
at async t2 (C:\Users\HP\VSworkspace\nextjs\31_01_2024_abg_feature_dev\cpm\node_modules\next\dist\compiled\next-server\app-page.runtime.dev.js:38:6412)
at async rS (C:\Users\HP\VSworkspace\nextjs\31_01_2024_abg_feature_dev\cpm\node_modules\next\dist\compiled\next-server\app-page.runtime.dev.js:41:1369)
at async doRender (C:\Users\HP\VSworkspace\next
sol: the vm server is not running

Blocker :The problem statement mentions that only one consumer out of the two is able to consume messages from a topic. Even when the order of consumers is changed, only the first consumer can consume messages, while the second one remains inactive.
sol: After identifying the problem, the solution involves reviewing the configuration of the consumers and producers. Specifically, the issue is related to the client ID and group ID used by these components.
Understanding Client and Group IDs: In Apache Kafka, the client ID is used to identify the source of requests made to the Kafka cluster. Each client must have a unique client ID. The group ID, on the other hand, is used to identify a group of consumers that work together to consume from one or more topics. All consumers within the same group share the same group ID.
Correction in Configuration: The solution involves changing the client ID and group ID for each consumer and producer. Previously, both consumers and producers were using the same constant values for client ID and group ID. By changing these values to be different for each consumer and producer, the issue is resolved.
Effect of Changes: After making these changes, both consumers are now able to consume messages from the topic correctly. This suggests that the problem was likely related to conflicts or limitations imposed by using the same client ID or group ID for multiple components.
