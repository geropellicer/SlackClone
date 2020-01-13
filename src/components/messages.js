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

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
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
    }
  }, [activeChannel, userInfo, messagesRef]);

  return (
    <div style={{ marginLeft: 320 }}>
      <MessagesHeader />

      <Segment>
        <Comment.Group className="messages">
          {messages.length > 0 ? messages.map(message => (
            <Message
              key={message.timestamp}
              message={message}
              user={userInfo}
            />
          )) : null}
        </Comment.Group>
      </Segment>

      <MessageForm />
    </div>
  );
};

export default Messages;
