import React from "react";
import Messages from "./Messages";
import Input from "./Input";

const Chat = ({ messageTo }) => {
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{messageTo}</span>
        <div className="icons"></div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
