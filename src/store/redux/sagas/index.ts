import { all } from "redux-saga/effects";

import chatSagas from "./chat.saga";
import leaderboardSagas from "./leaderboard.saga";
import coinflipSagas from "./coinflip.saga";
import minesSagas from "./mines.saga";
import paymentSagas from "./payment.saga";

export default function* rootSaga() {
  yield all([
    ...chatSagas,
    ...paymentSagas,
    ...leaderboardSagas,
    ...coinflipSagas,
    ...minesSagas,
  ]);
}
