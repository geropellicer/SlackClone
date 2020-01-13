import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const Message = ({message, user}) => {
  const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? "message__self" : "";
  };

  const isImageMessage = (message) => {
    return message.hasOwnProperty('image');
  }

  const timeFromNow = timestamp => moment(timestamp).fromNow();

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnMessage(message, user)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        <Comment.Text>{message.content}</Comment.Text>
        {isImageMessage(message) ?
          <Image src={message.image} className="message_image"/>
          : null }
      </Comment.Content>
    </Comment>
  );
};

export default Message;
