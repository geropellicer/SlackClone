import * as aTypes from './types';

export const setUser = user => {
    return {
        type: aTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
};