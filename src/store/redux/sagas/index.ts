import { all } from 'redux-saga/effects';

import chatSagas from './chat.saga';
import leaderboardSagas from './leaderboard.saga';
import coinflipSagas from './coinflip.saga';
import minesSagas from './mines.saga';
import userSagas from './user.saga';

export default function* rootSaga() {
  yield all([...chatSagas, ...leaderboardSagas, ...coinflipSagas, ...minesSagas, ...userSagas]);
}
