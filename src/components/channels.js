import React, { useState, useEffect } from "react";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label
} from "semantic-ui-react";
import firebase from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../redux/actions";

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const [channelName, setChannelName] = useState("");
  const [channelDescription, setchannelDescription] = useState("");

  const [channelsRef] = useState(firebase.database().ref("channels"));

  const userInfo = useSelector(state => state.user.currentUser);
  const selectedChannel = useSelector(state => state.channels.currentChannel);

  const [channel, setChannel] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [messagesRef] = useState(firebase.database().ref("messages"));

  const dispatch = useDispatch();

  const emptyForm = () => {
    setChannelName("");
    setchannelDescription("");
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
  };

  const updateChannelAbout = e => {
    setchannelDescription(e.target.value);
  };

  const formIsValid = () => {
    if (channelName && channelDescription) {
      return true;
    } else {
      return false;
    }
  };

  const addChannel = () => {
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      description: channelDescription,
      createdBy: {
        name: userInfo.displayName,
        avatar: userInfo.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        closeModal();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const createChannel = e => {
    e.preventDefault();
    if (formIsValid()) {
      addChannel();
    } else {
      return false;
    }
  };

  const clearNotifications = () => {
    let index = notifications.findIndex(
      notification => notification.id === channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].total = notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      setNotifications(updatedNotifications);
    }
  };

  const changeChannel = channel => {
    clearNotifications();
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
    setChannel(channel);
  };

  const getNotificationsCount = channel => {
    let count = 0;

    notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  const displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => {
          changeChannel(channel);
        }}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={selectedChannel && channel.id === selectedChannel.id}
      >
        {getNotificationsCount(channel) && (
          <Label color="red">{getNotificationsCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));

  const handleNotifications = (
    channelId,
    currentChannelId,
    notifications,
    snap
  ) => {
    let lastTotal = 0;
    let index = notifications.findIndex(
      notification => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    setNotifications(notifications);
  };

  useEffect(() => {
    const addListeners = async () => {
      await channelsRef.on("child_added", snap => {
        setChannels(prevChannels => [...prevChannels, snap.val()]);
      });
    };

    addListeners();
    return () => {
      channelsRef.off();
    };
    // eslint-disable-next-line
  }, [channelsRef]);

  useEffect(() => {
    const addNotificationsListener = channelId => {
      messagesRef.child(channelId).on("value", snap => {
        if (channel) {
          handleNotifications(channelId, channel.id, notifications, snap);
        }
      });
    };

    if (channel && channelsRef) {
      channelsRef.on("child_added", snap => {
        addNotificationsListener(snap.key);
      });
    }

    // eslint-disable-next-line
  }, [channel, channelsRef]);

  useEffect(() => {
    const setFirstChannel = () => {
      if (channels.length > 0 && firstLoad) {
        const firstChannel = channels[0];
        dispatch(setCurrentChannel(firstChannel));
        setChannel(firstChannel);
        setFirstLoad(false);
      }
    };
    setFirstChannel();
  }, [channels, dispatch, firstLoad]);

  return (
    <React.Fragment>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channels.length}){" "}
          <Icon name="add" onClick={openModal} style={{ cursor: "pointer" }} />
        </Menu.Item>
        {displayChannels(channels)}
      </Menu.Menu>

      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={createChannel}>
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
          <Button color="green" inverted onClick={createChannel}>
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
