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

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const displayChannelName = () => {
    return activeChannel ? activeChannel.name : "";
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
  };

  const displayMessages = messages => {
    if (messages.length > 0) {
      return messages.map(message => (
        <Message key={message.timestamp} message={message} user={userInfo} />
      ));
    } else {
      return null;
    }
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

  useEffect(() => {
    const channelMessages = [...messages];
    let regex;
    const searchResults = channelMessages.reduce((acc, message) => {
      if (searchTerm.trim().substr(0, 5) === "user:") {
        regex = new RegExp(
          searchTerm
            .trim()
            .substring(5)
            .trim(),
          "gi"
        );
        if (message.user.name.match(regex)) {
          acc.push(message);
        }
      } else {
        regex = new RegExp(searchTerm, "gi");
        if (message.content && message.content.match(regex)) {
          acc.push(message);
        }
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setTimeout(() => {
      setSearchLoading(false);
    }, 1000);
  }, [searchTerm]);

  return (
    <div style={{ marginLeft: 320 }}>
      <MessagesHeader
        channelName={displayChannelName()}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={handleSearchChange}
        searchLoading={searchLoading}
      />

      <Segment>
        <Comment.Group className="messages">
          {searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)}
        </Comment.Group>
      </Segment>

      <MessageForm />
    </div>
  );
};

export default Messages;
