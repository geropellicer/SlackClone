import * as aTypes from './types';

export const setUser = user => {
    return {
        type: aTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
};

export const clearUser = user => {
    return {
        type: aTypes.CLEAR_USER,
    }
}

export const setCurrentChannel= channel => {
    return {
        type: aTypes.SET_CURRENT_CHANNEL,
        payload: {
            currentChannel: channel
        }
    }
}