import React, { useState, useEffect } from "react";
import { setCurrentChannel, setPrivateChannel } from "../redux/actions";
import { Menu, Icon } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../firebase";

const Starred = () => {
  const starredChannels = useSelector(state => state.channels.starredChannels);
  const selectedChannel = useSelector(state => state.channels.currentChannel);
  const [usersRef] = useState(firebase.database().ref("users"));
  const [userInfo] = useState(useSelector(state => state.user.currentUser));

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

 /* useEffect(() => {
    const addListeners = userId => {
      usersRef
        .child(userId)
        .child("starred")
        .on("child_added", snap => {
          console.log("CHILD ADDED");
          const starredChannel = { id: snap.key, ...snap.val() };
          setStarredChannels(prevStarred => [...prevStarred, starredChannel]);
          console.log(starredChannels);

        });

      usersRef
        .child(userId)
        .child("starred")
        .on("child_removed", snap => {
          const channelToRemove = {id: snap.key, ...snap.val()};
          console.log(starredChannels);
          const secondArray = starredChannels;
          console.log(secondArray);
           secondArray.splice(secondArray.indexOf(channelToRemove), 1);
          console.log(secondArray);
           console.log(starredChannels);
          console.log(channelToRemove);
          setStarredChannels(secondArray);
        });
    };
    if (userInfo) {
      addListeners(userInfo.uid);
    }
    return () => {};
    // eslint-disable-next-line
  }, []);
*/
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
