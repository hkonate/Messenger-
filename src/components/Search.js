import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
const Search = () => {
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async (findName) => {
    if (!findName) {
      return;
    }
    const q = query(
      collection(db, "users"),
      where("displayName", ">=", findName),
      where("displayName", "<=", findName + "\uf8ff")
    );
    try {
      const querySnapshot = await getDocs(q);
      const temporyArray = [];
      querySnapshot.forEach((doc) => {
        temporyArray.push(doc.data());
      });
      setUserList(temporyArray);
    } catch (err) {
      console.log(err.message);
      setErr(true);
    }
  };

  const handleSelect = async (index) => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > userList[index].uid
        ? currentUser.uid + userList[index].uid
        : userList[index].uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: userList[index].uid,
            displayName: userList[index].displayName,
            photoURL: userList[index].photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", userList[index].uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}
    setUserList(null);
    setUsername("");
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onChange={(e) => {
            handleSearch(e.target.value);
            setUsername(e.target.value);
          }}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {userList &&
        username &&
        userList.map((user, index) => {
          // doesn't show current user
          if (currentUser.uid === user.uid) return null;
          return (
            <div
              className="userChat"
              key={index}
              onClick={() => handleSelect(index)}
            >
              <img src={user.photoURL} alt="User's avatar" />
              <div className="userChatInfo">
                <span>{user.displayName}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Search;
