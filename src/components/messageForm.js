import React, { useState, useEffect, useCallback } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import UploadFileModal from "./uploadFileModal";
import uuidv4 from "uuid/v4";

const MessageForm = ({isPrivateChannel, getMessagesRef}) => {
  const [storageRef] = useState(firebase.storage().ref());

  const [messageText, setMessageText] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const activeChannel = useSelector(state => state.channels.currentChannel);
  const [userInfo] = useState(useSelector(state => state.user.currentUser));

  const [uploadTask, setUploadTask] = useState(null);
  const [uploadState, setUploadState] = useState("");
  const [percentUploaded, setPercentUploaded] = useState(0);

  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const updateMessageText = e => {
    setMessageText(e.target.value);
  };

  const createMessage = useCallback(
    (fileeUrl = null) => {
      const message = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          id: userInfo.uid,
          name: userInfo.displayName,
          avatar: userInfo.photoURL
        }
      };
  
      if (fileeUrl) {
        message["image"] = fileeUrl;
      } else {
        message["content"] = messageText;
      }
      return message;
    },
    [messageText, userInfo],
  )

  const sendFileMessage = useCallback(
    (fileeUrl, ref, pathToUpload) => {
      ref
      .child(pathToUpload)
      .push()
      .set(createMessage(fileeUrl))
      .then(() => {
        setUploadState("done");
        closeModal();
      })
      .catch(error => {
        console.log(error);
        setErrors(prevErrors => [...prevErrors, error]);
      });
    },
    [createMessage],
  )

  const sendMessage = () => {
    if (messageText && userInfo && activeChannel) {
      setLoading(true);
      getMessagesRef()
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
    } else if (!messageText) {
      setErrors(prevErrors => [...prevErrors, { message: "Add a message" }]);
      console.log(errors);
    } else if (!userInfo) {
      setErrors(prevErrors => [
        ...prevErrors,
        {
          message:
            "Couldn't retrieve current user info. Please refresh or logout and login again."
        }
      ]);
      console.log(errors);
    } else if (!activeChannel) {
      setErrors(prevErrors => [
        ...prevErrors,
        { message: "Couldn't retrieve current channel info." }
      ]);
      console.log(errors);
    }
  };

  const uploadFile = async (file, metadata) => {
    const filePath = `${getPath()}${uuidv4()}.jpg`;

    try {
      setUploadState("uploading");
      setUploadTask(storageRef.child(filePath).put(file, metadata));
    } catch (error) {
      console.log(error);
      setErrors(prevErrors => [...prevErrors, error]);
      setUploadState("error");
      setUploadTask(null);
    }
  };

  const getPath = () => {
    if(isPrivateChannel){
      return `chat/private-${activeChannel.id}`;
    } else{
      return 'chat/public';
    }
  }

  useEffect(() => {
    const ref = getMessagesRef();
    const channel = activeChannel?.id;

    if (uploadTask !== null && uploadState === "uploading") {
      try {
        uploadTask.on(
          "state_changed",
          snap => {
            setPercentUploaded(
              Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
            );
          },
          error => {
            console.log(error);
          },
          () => {
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadurl => {
                sendFileMessage(downloadurl, ref, channel);
              })
              .catch(error => {
                console.log(error);
                setErrors(prevErrors => [...prevErrors, error]);
                setUploadState("error");
                setUploadTask(null);
              });
          }
        );
      } catch (error) {
        console.log(error);
        setErrors(prevErrors => [...prevErrors, error]);
        setUploadState("error");
        setUploadTask(null);
      }
    }

    return () => {};
  }, [uploadTask, sendFileMessage, uploadState, activeChannel, getMessagesRef]);

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
          onClick={openModal}
          color="teal"
          content="Upload media"
          labelPosition="right"
          icon="cloud upload"
          disabled={loading}
        />
        <UploadFileModal
          modal={modal}
          closeModal={closeModal}
          uploadFile={uploadFile}
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Button.Group>
    </Segment>
  );
};

export default MessageForm;
