import {
    all
} from 'redux-saga/effects';

import chatSagas from './chat.saga';
import leaderboardSagas from './leaderboard.saga';

export default function* rootSaga() {
    yield all([
        ...chatSagas,
        ...leaderboardSagas
    ]);
}
