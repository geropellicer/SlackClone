import React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";

import ColorPanel from "./colorPanel";
import SidePanel from "./sidePanel";
import Messages from "./messages";
import MetaPanel from "./metaPanel";

const App = () => {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel />
      <Grid.Column>
        <Messages style={{ marginLeft: 320 }} />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

export default App;
