import { put, call, fork, take, takeLatest, delay } from 'redux-saga/effects';
import KartelSocket from '@/utils/socket-service';
// import { ELeaderboardSocketEvent } from '@/types/leader';
// import { ELeaderboardSocketAction } from '../reducers/leaderboard.type';
import { eventChannel } from 'redux-saga';
// import { subscribeUserServer } from '../actions/user.action';
import { DISCONNECT_USER, SUBSCRIBE_USER } from '../reducers/user.reducer';
// import { ILeaderType } from '../reducers/leaderboard.reducer';
// import { userActions } from '../actions';

function subscribe(socket) {
  return eventChannel((emit) => {
    socket.on(
      "update-wallet",
      (wallet, denom) => {
        console.log(wallet, denom);
      }
    );
    return () => { };
  });
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* subscribeSaga() {
  try {
    yield delay(300);
    yield fork(read, KartelSocket.user);
    yield delay(300);
  } catch (error) {
    console.error(error);
  }
}

function* stopChannelSaga() {
  if (KartelSocket.user) {
    KartelSocket.user.off();
    KartelSocket.user.disconnect();
  }
}

const sagas = [
  takeLatest(SUBSCRIBE_USER, subscribeSaga),
  takeLatest(DISCONNECT_USER, stopChannelSaga)
];

export default sagas;
