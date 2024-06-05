import {
    combineReducers,
} from '@reduxjs/toolkit';

import chatReducer from './chat.reducer';

export default () => {
    return combineReducers({
        chat: chatReducer,
    });
};
