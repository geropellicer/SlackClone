import React from 'react';
import { Icon } from "semantic-ui-react";
import './spinner.css';

const Spinner = () => {
    
    return(
        <div className="overlay" id="spinnerContainer">
            <Icon className="spinner" name="puzzle piece" color="orange"/>
        </div>
    );
};

export default Spinner;