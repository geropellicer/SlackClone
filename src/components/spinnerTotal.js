import React from 'react';

import {Loader, Dimmer} from 'semantic-ui-react';

const SpinnerTotal = () => (
    <Dimmer>
        <Loader size="huge" content={"Preparing chat..."} />
    </Dimmer>
);

export default SpinnerTotal;