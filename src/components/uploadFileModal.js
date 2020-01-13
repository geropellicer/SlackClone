import React, { useState } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from "mime-types";
import ProgressBar from "./porgressBar";

const UploadFileModal = ({ modal, closeModal, uploadFile, percentUploaded, uploadState }) => {
  const [file, setFile] = useState(null);
  const [authorizedFileFormats] = useState(["image/jpeg", "image/png"]);

  const addFile = e => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const isAuthorizedFileType = filename => {
    return authorizedFileFormats.includes(mime.lookup(filename));
  };

  const clearFile = () => {
    setFile(null);
  };

  const sendFile = () => {
    if (file !== null) {
      if (isAuthorizedFileType(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        clearFile();
      }
    }
  };

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an image file</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
          onChange={addFile}
        />
        {uploadState === "uploading" && <ProgressBar percentUploaded={percentUploaded}/>}
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={sendFile}
          color="green"
          inverted
          disabled={file === null}
        >
          <Icon name="checkmark" />
          Send
        </Button>
        <Button onClick={closeModal} color="red" inverted>
          <Icon name="remove" />
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UploadFileModal;
