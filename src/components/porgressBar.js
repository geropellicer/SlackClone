import React from "react";
import {Progress} from "semantic-ui-react";

const ProgressBar = ({ uploadState, percentUploaded }) => {
  return (
    <Progress
      className="progress__bar"
      progress
      indicating
      percent={percentUploaded}
      size="medium"
      inverted
    />
  );
};

export default ProgressBar;
