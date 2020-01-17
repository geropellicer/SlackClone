import * as aTypes from "../actions/types";

const initialUserState = {
  currentUser: null,
  isLoadingUser: true
};

export const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case aTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoadingUser: false
      };
    case aTypes.CLEAR_USER:
      return {
        currentUser: null,
        isLoadingUser: false
      };
    default:
      return state;
  }
};

const initialChannelState = {
  currentChannel: null,
  isPrivateChannel: false,
  starredChannels: []
};

export const channelsReducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case aTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      };
    case aTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      };
    case aTypes.ADD_STARRED_CHANNEL:
      return {
        ...state,
        starredChannels: [...state.starredChannels, action.payload.starredChannel]
      };
    case aTypes.REMOVE_STARRED_CHANNEL:
      let newState = [...state.starredChannels];
      newState.splice(state.starredChannels.indexOf(action.payload.starredChannel), 1)
      return {
        ...state,
        starredChannels: newState
      };
    default:
      return state;
  }
};
