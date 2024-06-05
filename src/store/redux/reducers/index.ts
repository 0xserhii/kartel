import {
    combineReducers,
} from '@reduxjs/toolkit';

import chatReducer from './chat.reducer';
import leaderboardReducer from './leaderboard.reducer';

export default () => {
    return combineReducers({
        chat: chatReducer,
        leaderboard: leaderboardReducer
    });
};
