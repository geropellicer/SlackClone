import { combineReducers } from "redux";
import { userReducer, channelsReducer } from "./index";
const allReducers = combineReducers({
  user: userReducer,
  channels: channelsReducer
});

export default allReducers;
