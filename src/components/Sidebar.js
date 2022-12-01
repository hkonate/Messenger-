import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
const Sidebar = ({ setMessageTo }) => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <Chats setMessageTo={setMessageTo} />
    </div>
  );
};

export default Sidebar;
