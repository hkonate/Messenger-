import React, { useContext, useState } from "react";
import Image from "../img/image.svg";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleKey = (e) => {
    e.code === "Enter" && handleSend();
  };

  const handleSend = async () => {
    if (text.includes(`[: ${img?.type}]`) === false) {
      console.log("1");
      setImg(null);
    }
    if (img) {
      console.log("3", text);
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          setText("");
          setImg(null);
        },
        () => {
          console.log("je susi passé");
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
                type: img.type,
              }),
            });
          });
        }
      );
    } else if (text) {
      console.log("4", text);
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    if (text) {
      console.log("tp");
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    }
    console.log("pk");
    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onKeyDown={handleKey}
        onChange={(e) => {
          if (img) {
            if (e.target.value.includes(`[: ${img.type}]`)) {
              setText(e.target.value);
              console.log(e.target.value.split(`[: ${img.type}]`).join(""));
            } else {
              setText(e.target.value + `[: ${img.type}]`);
              console.log(img);
            }
          } else {
            setText(e.target.value);
            console.log(img);
          }
        }}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          disabled={img}
          onChange={(e) => {
            if (img) {
              setText(text.split(`[: ${img.type}]`).join(""));
              setImg(null);
              setImg(e.target.files[0]);
              console.log("nb");
            } else {
              setImg(e.target.files[0]);
            }
            if (text.length > 0) {
              console.log("nw");
              console.log(text);
              setText(text + `[: ${e.target.files[0].type}]`);
            } else {
              console.log("nc");
              setText(`[: ${e.target.files[0].type}]`);
            }
          }}
        />
        <label htmlFor="file">
          <img
            style={{ cursor: img ? "not-allowed" : "pointer" }}
            src={Image}
            alt=""
          />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
