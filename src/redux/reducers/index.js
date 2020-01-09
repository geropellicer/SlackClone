import * as aTypes from '../actions/types';

const initialUserState = {
    currentUser: null,
    isLoadingUser: true
}

export const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case aTypes.SET_USER:
            return{
                currentUser: action.payload.currentUser,
                isLoadingUser: false
            }
        case aTypes.CLEAR_USER:
            return{
                currentUser: null,
                isLoadingUser: false
            }
        default:
            return state;
    }
}


const initialChannelState = {
    currentChannel: null
}

export const channelsReducer = (state = initialChannelState, action) => {
    switch (action.type) {
        case aTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }    
        default:
            return state;
    }
}