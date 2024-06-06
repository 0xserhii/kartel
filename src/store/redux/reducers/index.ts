import {
    combineReducers,
} from '@reduxjs/toolkit';

import chatReducer from './chat.reducer';
import leaderboardReducer from './leaderboard.reducer';
import coinflipReducer from './coinflip.reducer';

export default () => {
    return combineReducers({
        chat: chatReducer,
        leaderboard: leaderboardReducer,
        coinflip: coinflipReducer
    });
};
