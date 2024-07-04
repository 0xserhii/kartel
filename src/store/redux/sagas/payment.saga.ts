import { eventChannel } from "redux-saga";

import {
  put,
  call,
  fork,
  take,
  cancel,
  takeLatest,
  delay,
} from "redux-saga/effects";

import { paymentActions, userActions } from "../actions";
import { getAccessToken } from "@/utils/axios";
import KartelSocket from "@/utils/socket-service";
import {
  EPaymentEvents,
  TAdminWallet,
  TUpdateBalanceParam,
} from "@/types/payment";
import { EPaymentSocketAction } from "../reducers/payment.type";

let socketTask;

function subscribe(socket) {
  return eventChannel((emit) => {
    socket.on(EPaymentEvents.setAdminWallet, (data: TAdminWallet) => {
      emit(paymentActions.setAdminWallet(data));
    });

    socket.on(EPaymentEvents.updateBalance, (data: TUpdateBalanceParam) => {
      emit(paymentActions.updateBalancePayment(data));
      emit(
        userActions.siteBalanceUpdate({
          value: data.walletValue,
          denom: data.denom,
        })
      );
    });

    socket.on(EPaymentEvents.paymentFailed, (data: string) => {
      emit(paymentActions.paymentFailed(data));
    });

    return () => {};
  });
}

function* deposit(socket, action) {
  yield call([socket, socket.emit], EPaymentEvents.deposit, action.payload);
}

function* withdraw(socket, action) {
  yield call([socket, socket.emit], EPaymentEvents.withdraw, action.payload);
}

function* login(socket) {
  const token = getAccessToken();
  yield call([socket, socket.emit], EPaymentEvents.login, token);
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* withdrawSaga(action) {
  try {
    yield delay(200);
    yield fork(withdraw, KartelSocket.payment, action);
  } catch (error) {
    console.log(error);
  }
}

function* depositSaga(action) {
  try {
    yield delay(200);
    yield fork(deposit, KartelSocket.payment, action);
  } catch (error) {
    console.log(error);
  }
}

function* subscribeSaga() {
  try {
    yield fork(read, KartelSocket.payment);
    yield delay(200);
  } catch (error) {
    console.log(error);
  }
}

function* loginChanelSaga() {
  try {
    yield delay(500);
    socketTask = yield fork(login, KartelSocket.payment);
  } catch (e) {
    console.log(e);
  }
}

function* stopChanelSaga() {
  if (KartelSocket.payment) {
    KartelSocket.payment.off();
    KartelSocket.payment.disconnect();
  }

  yield cancel(socketTask);
}

const sagas = [
  takeLatest(EPaymentSocketAction.SUBSCRIBE_PAYMENT, subscribeSaga),
  takeLatest(EPaymentSocketAction.WITHDRAW, withdrawSaga),
  takeLatest(EPaymentSocketAction.DEPOSIT, depositSaga),
  takeLatest(EPaymentSocketAction.LOGIN_PAYMENT, loginChanelSaga),
  takeLatest(EPaymentSocketAction.DISCONNECT_PAYMENT, stopChanelSaga),
];

export default sagas;
