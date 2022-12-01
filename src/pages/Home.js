import React from "react";
import Chat from "../components/Chat";
import SideBar from "../components/Sidebar";
import { useState } from "react";

const Home = () => {
  const [messageTo, setMessageTo] = useState("");
  return (
    <div className="home">
      <div className="container">
        <SideBar setMessageTo={setMessageTo} />
        <Chat messageTo={messageTo} />
      </div>
    </div>
  );
};

export default Home;
