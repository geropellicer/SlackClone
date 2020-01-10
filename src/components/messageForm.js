import React, { useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { useSelector } from "react-redux";
import firebase from "../firebase";

const MessageForm = () => {
  const [messagesRef] = useState(firebase.database().ref("messages"));

  const [messageText, setMessageText] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const activeChannel = useSelector(state => state.channels.currentChannel);
  const userInfo = useSelector(state => state.user.currentUser);

  const updateMessageText = e => {
    setMessageText(e.target.value);
  };

  const createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: messageText,
      user: {
        id: userInfo.uid,
        name: userInfo.displayName,
        avatar: userInfo.photoURL
      }
    };
    return message;
  };

  const sendMessage = () => {
    if (messageText && userInfo && activeChannel) {
      setLoading(true);
      messagesRef
        .child(activeChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setMessageText("");
          setErrors([]);
        })
        .catch(err => {
          setLoading(false);
        });
    } else if(!messageText) {
      setErrors(prevErrors => [...prevErrors, { message: "Add a message" }]);
      console.log(errors);
    } else if(!userInfo){
      setErrors(prevErrors => [...prevErrors, { message: "Couldn't retrieve current user info. Please refresh or logout and login again." }]);
      console.log(errors);
    } else if(!activeChannel){
      setErrors(prevErrors => [...prevErrors, { message: "Couldn't retrieve current channel info." }]);
      console.log(errors);

    }
  };

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        placeholder="Write your message"
        value={messageText}
        className={
          errors.some(error => error.message.includes("message")) ? "error" : ""
        }
        onChange={updateMessageText}
      />
      <Button.Group icon widths="2">
        <Button
          onClick={sendMessage}
          color="orange"
          content="Add reply"
          labelPosition="left"
          icon="edit"
          disabled={loading}
        />
        <Button
          color="teal"
          content="Upload media"
          labelPosition="right"
          icon="cloud upload"
          disabled={loading}
        />
      </Button.Group>
    </Segment>
  );
};

export default MessageForm;
