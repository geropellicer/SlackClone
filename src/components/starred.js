import React, { useState } from "react";
import {setCurrentChannel, setPrivateChannel} from '../redux/actions';
import { Menu, Icon } from "semantic-ui-react";
import {useSelector, useDispatch} from 'react-redux';


const Starred = () => {
  const [starredChannels, setStarredChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const selectedChannel = useSelector(state => state.channels.currentChannel);

  const dispatch = useDispatch();

  const changeChannel = channel => {
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
  };

  const displayChannels = starredChannels =>
  starredChannels.length > 0 &&
  starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => {
          changeChannel(channel);
        }}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={selectedChannel && channel.id === selectedChannel.id}
      >
        # {channel.name}
      </Menu.Item>
    ));

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> FAVORITES
        </span>{" "}
        ({starredChannels.length}){" "}
      </Menu.Item>
      {displayChannels(starredChannels)}
    </Menu.Menu>
  );
};

export default Starred;
