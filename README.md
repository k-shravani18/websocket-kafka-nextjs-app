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
