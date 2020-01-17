import React, {useEffect, useState} from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = ({
  channelName,
  numUniqueUsers,
  handleSearchChange,
  searchLoading,
  isPrivateChannel,
  handleStar,
  starredChannelsIds,
  channelId
}) => {

  const [isChannelStarred, setIsChannelStarred] = useState(false);

  useEffect(() => {
    setIsChannelStarred(starredChannelsIds.includes(channelId));
    return () => {
      //
    };
  }, [starredChannelsIds])

  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}{" "}
          {!isPrivateChannel ? (
            <Icon
              onClick={() => {handleStar(channelId)}}
              name={isChannelStarred ? "star" : "star outline"}
              color={isChannelStarred ? "yellow" : "black"}
              className="starIcon"
            />
          ) : null}
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>

      <Header floated="right">
        <Input
          loading={searchLoading}
          onChange={handleSearchChange}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
