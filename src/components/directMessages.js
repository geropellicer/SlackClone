import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../firebase";
import { setCurrentChannel, setPrivateChannel } from "../redux/actions";

const DirectMessages = () => {
  const [userInfo] = useState(useSelector(state => state.user.currentUser));
  const [usersRef] = useState(firebase.database().ref("users"));
  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [presenceRef] = useState(firebase.database().ref("presence"));
  const [users, setUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const dispatch = useDispatch();

  const isUserOnline = user => {
    return user.status === "online";
  };

  const getChannelId = userId => {
    const currentUserUid = userInfo.uid;
    return userId < currentUserUid
      ? `${userId}/${currentUserUid}`
      : `${currentUserUid}/${userId}`;
  };

  const changeChannel = user => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    dispatch(setCurrentChannel(channelData));
    dispatch(setPrivateChannel(true));
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
    if (userInfo) {
      addListeners(userInfo.uid);
    }
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
      if (userInfo.uid !== snap.key) {
        addStatusToUser(snap.key);
      }
    });

    presenceRef.on("child_removed", snap => {
      if (userInfo.uid !== snap.key) {
        addStatusToUser(snap.key, false);
      }
    });
  }, [users]);

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
          onClick={() => changeChannel(user)}
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
