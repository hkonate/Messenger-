import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  const hours = new Date(message.date.seconds * 1000).getHours();
  const minutes = new Date(message.date.seconds * 1000).getMinutes();
  return (
    <>
      {(message.text || message.img) && (
        <div
          ref={ref}
          className={`message ${
            message.senderId === currentUser.uid && "owner"
          }`}
        >
          <div className="messageInfo">
            <img
              src={
                message.senderId === currentUser.uid
                  ? currentUser.photoURL
                  : data.user.photoURL
              }
              alt=""
            />
            <span style={{ textAlign: "center", marginTop: 4, fontSize: 12 }}>
              {(hours < 10 ? `0${hours}` : hours) +
                ":" +
                (minutes < 10 ? `0${minutes}` : minutes)}
            </span>
          </div>
          <div className="messageContent">
            {message.text && message.text !== `[: ${message.type}]` && (
              <p>{message.text.split(`[: ${message.type}]`).join("")}</p>
            )}
            {message.img && <img src={message.img} alt="" />}
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
