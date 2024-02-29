//page.tsx
import React, { useEffect } from "react";
import MyComponent from "./components/KafkaMessages";
import startServer from "./server";

startServer();
const home = () => {

  return (
    <div>
      <MyComponent />
    </div>
  );
};

export default home;
