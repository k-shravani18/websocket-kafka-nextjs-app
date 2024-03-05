// //page.tsx
import React, { useEffect } from "react";
import MyComponent from "./components/KafkaMessages";
import startServer from "./server";
import MessageSenderPage from "./components/MessageSenderPage";

startServer();
const Home = () => {
  return (
    <div>
      <MyComponent />
      <MessageSenderPage />
    </div>
  );
};
export default Home;

