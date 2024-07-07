import { put, call, fork, take, takeLatest, delay } from "redux-saga/effects";
import KartelSocket from "@/utils/socket-service";
import { eventChannel } from "redux-saga";
import { dashboardActions } from "../actions";
import { DashboardType, EDashboardSocketEvent } from "@/types/dashboard";
import { EDashboardSocketAction } from "../reducers/dashboard.type";
import { IDashboardType } from "../reducers/dashboard.reducer";

let socketTask;

function subscribe(socket) {
  return eventChannel((emit) => {
    socket.on(
      EDashboardSocketEvent.GET_DASHBOARD_HISTORY,
      (data: { message: string; dashboard: DashboardType }) => {
        emit(dashboardActions.getDashboardboardHistory(data.dashboard));
      }
    );
    socket.on(
      EDashboardSocketEvent.GET_TOP_PLAYERS,
      (data: {
        message: string; topPlayers: any
      }) => {
        console.log(data);
        emit(dashboardActions.getTopPlayersHistory(data.topPlayers));
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
    yield fork(read, KartelSocket.dashboard);
    yield delay(300);
  } catch (error) {
    console.error(error);
  }
}

function* stopChannelSaga() {
  if (KartelSocket.dashboard) {
    KartelSocket.dashboard.off();
    KartelSocket.dashboard.disconnect();
  }
  yield socketTask;
}

const sagas = [
  takeLatest(EDashboardSocketAction.SUBSCRIBE_DASHBOARD, subscribeSaga),
  takeLatest(EDashboardSocketAction.DISCONNECT_DASHBOARD, stopChannelSaga),
];

export default sagas;
