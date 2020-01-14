import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { useSelector } from "react-redux";
import firebase from "../firebase";

const DirectMessages = () => {
  const [userInfo] = useState(useSelector(state => state.user.currentUser));
  const [usersRef] = useState(firebase.database().ref("users"));
  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [presenceRef] = useState(firebase.database().ref("presence"));
  const [users, setUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState();

  const isUserOnline = user => {
    return user.status === "online";
  };

  useEffect(() => {
    const addListeners = currentUserUid => {
      //var loadedUsers = [];

      usersRef.on("child_added", snap => {
        if (currentUserUid !== snap.key) {
          let user = snap.val();
          user["uid"] = snap.key;
          user["status"] = "offline";
          setUsers(prevUsers => [...prevUsers, user]);
        }
      });

      connectedRef.on("value", snap => {
        if (snap.val() === true) {
          const ref = presenceRef.child(currentUserUid);
          ref.set(true);
          ref.onDisconnect().remove(err => {
            if (err !== null) {
              console.log(err);
            }
          });
        }
      });
    };
    addListeners(userInfo.uid);
  }, []);

  useEffect(() => {
    const addStatusToUser = (userId, connected = true) => {
      const updatedUsers = users.reduce((acc, user) => {
        if (user.uid === userId) {
          user["status"] = `${connected ? "online" : "offline"}`;
        }
        return acc.concat(user);
      }, []);
      setConnectedUsers(updatedUsers);
    };

    presenceRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        addStatusToUser(snap.key);
      }
    });

    presenceRef.on("child_removed", snap => {
      if (currentUserUid !== snap.key) {
        addStatusToUser(snap.key, false);
      }
    });
  }, [users]);

  useEffect(() => {
    console.log("Users length:" + users.length);
  });

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>
      {users.map(user => (
        <Menu.Item
          key={user.uid}
          onClick={() => {
            console.log(user);
          }}
          style={{ opacity: 0.7, fontSyle: "italic" }}
        >
          <Icon name="circle" color={isUserOnline(user) ? "green" : "red"} />@
          {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default DirectMessages;
