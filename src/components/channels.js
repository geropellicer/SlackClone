import React, {useState} from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

const Channels = () => {
  const channels = [];
  const [modal, setModal] = useState(false);

  const [channelName, setChannelName] = useState('');
  const [channelDescription, setchannelDescription] = useState('');

  const emptyForm = () => {
      setChannelName('');
      setchannelDescription('');
  };

  const closeModal = () => {
    setModal(false);
    emptyForm();
  };

  const openModal = () => {
    setModal(true);
  };

  const updateChannelName = e => {
      setChannelName(e.target.value);
  }

  const updateChannelAbout = e => {
      setchannelDescription(e.target.value);
  }

  return (
    <React.Fragment>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channels.length}) <Icon name="add" onClick={openModal} />
        </Menu.Item>
      </Menu.Menu>

      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a channel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                fluid
                label="Name of channel"
                name="channelName"
                onChange={updateChannelName}
                value={channelName}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="About the channel"
                name="channelAbout"
                onChange={updateChannelAbout}
                value={channelDescription}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted>
            <Icon name="checkmark" />
            Add
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

export default Channels;
