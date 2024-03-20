// //page.tsx

import React, { useEffect } from "react";
import startServer from "./server";
import MessageSenderPage from "./components/MessageSenderPage";
import KafkaMessages from "./components/KafkaMessages";

startServer();
const Home = () => {
  return (
    <div>
      {/* <MyComponent /> */}
      <MessageSenderPage />
      <KafkaMessages />
    </div>
  );
};
export default Home;
