import React, { useEffect, useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./messagesHeader";
import MessageForm from "./messageForm";
import Message from "./message";
import { useSelector } from "react-redux";
import firebase from "../firebase";

const Messages = () => {
  const [messagesRef] = useState(firebase.database().ref("messages"));

  const [userInfo] = useState(useSelector(state => state.user.currentUser));
  const activeChannel = useSelector(state => state.channels.currentChannel);

  const [numUniqueUsers, setNumUniqueUsers] = useState("");

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const displayChannelName = () => {
    return activeChannel ? activeChannel.name : "";
  };

  useEffect(() => {
    const countUniqueUsers = () => {
      const uniqueUsers = messages.reduce((acc, message) => {
        if (!acc.includes(message.user.name)) {
          acc.push(message.user.name);
        }
        return acc;
      }, []);
      setNumUniqueUsers(`${uniqueUsers.length} users`);
    };

    const addMessageListener = channelId => {
      messagesRef.child(channelId).on("child_added", snap => {
        setMessages(prevMessages => [...prevMessages, snap.val()]);
        setLoadingMessages(false);
      });
    };

    const addListeners = channelId => {
      addMessageListener(channelId);
    };

    if (activeChannel && userInfo) {
      addListeners(activeChannel.id);
      countUniqueUsers();
    }
  }, [activeChannel, userInfo, messagesRef]);

  return (
    <div style={{ marginLeft: 320 }}>
      <MessagesHeader
        channelName={displayChannelName()}
        numUniqueUsers={numUniqueUsers}
      />

      <Segment>
        <Comment.Group className="messages">
          {messages.length > 0
            ? messages.map(message => (
                <Message
                  key={message.timestamp}
                  message={message}
                  user={userInfo}
                />
              ))
            : null}
        </Comment.Group>
      </Segment>

      <MessageForm />
    </div>
  );
};

export default Messages;
