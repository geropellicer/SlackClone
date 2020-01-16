import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './userPanel';
import Channels from './channels';
import DirectMessages from './directMessages';
import Starred from './starred';

const SidePanel = () => {
    return(
        <Menu size="large" inverted fixed="left" vertical style={{background: '#4c3c4c', fontSize: '1.2rem'}}>
            <UserPanel/>
            <Starred/>
            <Channels/>
            <DirectMessages/>
        </Menu>
    );
};

export default SidePanel;