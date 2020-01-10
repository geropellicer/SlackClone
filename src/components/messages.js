import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./messagesHeader";
import MessageForm from "./messageForm";

const Messages = () => {
  return (
    <div style={{ marginLeft: 320 }}>
      <MessagesHeader />

      <Segment>
        <Comment.Group className="messages">{/** Messages */}</Comment.Group>
      </Segment>

      <MessageForm/>
    </div>
  );
};

export default Messages;
