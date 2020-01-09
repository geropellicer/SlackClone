import React from "react";
import firebase from "../firebase";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import { useSelector } from "react-redux";

const UserPanel = () => {
  const userInfo = useSelector(state => state.user.currentUser);

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed out");
      });
  };

  const options = [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{userInfo.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change avatar</span>,
      disabled: false
    },
    {
      key: "signout",
      text: <span onClick={signOut}>Sign Out</span>,
      disabled: false
    }
  ];

  return (
    <Grid style={{ background: "#4c3c4c" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={userInfo.photoURL} spaced="right" avatar />
                  {userInfo.displayName}
                </span>
              }
              options={options}
            />
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
