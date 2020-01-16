import React, { useEffect, useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./messagesHeader";
import MessageForm from "./messageForm";
import Message from "./message";
import { useSelector } from "react-redux";
import firebase from "../firebase";

const Messages = () => {
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const [usersRef] = useState(firebase.database().ref("users"));

  const [userInfo] = useState(useSelector(state => state.user.currentUser));
  const activeChannel = useSelector(state => state.channels.currentChannel);
  const [stateActiveChannel, setStateActiveChannel] = useState(activeChannel);

  const [numUniqueUsers, setNumUniqueUsers] = useState(0);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [messagesLoaded, setMessagesLoaded] = useState([]);

  const [starredChannelsIds, setStarredChannelsIds] = useState([]);
  // const [channel, setChannel] = useState(null);

  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );

  const isPrivateChannel = useSelector(
    state => state.channels.isPrivateChannel
  );

  const handleStar = channelId => {
    let previous = starredChannelsIds;
    if (previous.includes(channelId)) {
      previous.splice(previous.indexOf("foo"), 1);
      removeFromFirebaseStarred(channelId);
    } else {
      previous.push(channelId);
      addToFirebaseStarred(channelId);
    }
    setStarredChannelsIds(previous);
  };

  const removeFromFirebaseStarred = channelId => {
    usersRef
      .child(`${userInfo.uid}/starred`)
      .child(activeChannel.id)
      .remove(err => {
        console.error(err);
      });
  };

  const addToFirebaseStarred = channelId => {
    usersRef.child(`${userInfo.uid}/starred`).update({
      [activeChannel.id]: {
        name: activeChannel.name,
        description: activeChannel.description,
        createdBy: {
          name: activeChannel.createdBy.name,
          avatar: activeChannel.createdBy.avatar
        }
      }
    });
  };

  useEffect(() => {
    if (usersRef && userInfo) {
      let previous = [];
      let object = {};
      usersRef
        .child(userInfo.uid)
        .child("starred")
        .once("value")
        .then(data => {
          if (data.val() !== null) {
            object = data.val();
            Object.keys(object).forEach(key => {
              console.log(key);
              previous.push(key);
            });
            setStarredChannelsIds(previous);
          }
        });
    }
  }, [usersRef, userInfo]);

  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  const displayChannelName = () => {
    return activeChannel
      ? `${isPrivateChannel ? "@ " : "# "}${activeChannel.name}`
      : "";
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
  };

  const displayMessages = messages => {
    if (!loadingMessages) {
      if (messages.length > 0) {
        return messages.map(message => (
          <Message key={message.timestamp} message={message} user={userInfo} />
        ));
      } else {
        return null;
      }
    } else {
      return <h5>loading...</h5>;
    }
  };

  const addUserStarsListener = (channelId, userId) => {
    let starred = [];

    usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          if (prevStarred) {
            //console.log(data.key);
          }
        }
      });
  };

  useEffect(() => {
    setStateActiveChannel(activeChannel);
  }, [activeChannel]);

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
      setMessagesLoaded([]);
      const ref = getMessagesRef();
      ref.child(channelId).on("child_added", snap => {
        //messagesLoaded.push(snap.val());
        setMessagesLoaded(prevMesgs => [...prevMesgs, snap.val()]);
      });
      setLoadingMessages(false);
    };

    const addListeners = channelId => {
      addMessageListener(channelId);
    };

    if (activeChannel && userInfo) {
      countUniqueUsers();
      addListeners(activeChannel.id);
      addUserStarsListener(activeChannel.id, userInfo.uid);
    }
    // eslint-disable-next-line
  }, [stateActiveChannel, userInfo, messagesRef]);

  useEffect(() => {
    setMessages(messagesLoaded);
  }, [messagesLoaded]);

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
    // eslint-disable-next-line
  }, [searchTerm]);

  return (
    <div style={{ marginLeft: 320 }}>
      <MessagesHeader
        channelName={displayChannelName()}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={handleSearchChange}
        searchLoading={searchLoading}
        isPrivateChannel={isPrivateChannel}
        handleStar={handleStar}
        isChannelStarred={starredChannelsIds.includes(activeChannel?.id)}
        channelId={activeChannel?.id}
      />

      <Segment>
        <Comment.Group className="messages">
          {searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)}
        </Comment.Group>
      </Segment>

      <MessageForm
        isPrivateChannel={isPrivateChannel}
        getMessagesRef={getMessagesRef}
      />
    </div>
  );
};

export default Messages;
