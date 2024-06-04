import {
    combineReducers,
} from 'redux';

import chatReducer from './chat.reducer';

export default () => {
    return combineReducers({
        chat: chatReducer,
    });
};
