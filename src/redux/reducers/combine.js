import {combineReducers} from 'redux';
import {userReducer} from './index';
const allReducers = combineReducers({
    user: userReducer,

});

export default allReducers;