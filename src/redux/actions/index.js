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

export const setPrivateChannel = isPrivate => {
    return {
        type: aTypes.SET_PRIVATE_CHANNEL,
        payload: {
            isPrivateChannel: isPrivate
        }
    }
}

export const addStarredChannel = channelId => {
    return {
        type: aTypes.ADD_STARRED_CHANNEL,
        payload: {
            starredChannel: channelId
        }
    }
}

export const removeStarredChannel = channelId => {
    return {
        type: aTypes.REMOVE_STARRED_CHANNEL,
        payload: {
            starredChannel: channelId
        }
    }
}