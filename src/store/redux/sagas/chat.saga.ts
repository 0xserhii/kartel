
import {
    eventChannel
} from 'redux-saga';

import {
    put,
    call,
    fork,
    take,
    cancel,
    takeLatest
} from 'redux-saga/effects';

import io from 'socket.io-client';
import { chatActions } from '../actions';
import { getAccessToken } from '@/lib/axios';
import { chatConstant } from '../constants';

let socket;
let socketTask;

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function connectSocket() {
    const socket = io(`${SERVER_URL}/chat`);
    return new Promise((resolve) => {
        socket.on('connect', () => {
            resolve(socket);
        });
    });
}

function subscribe(socket) {
    return eventChannel(emit => {
        socket.on('disconnect', () => {
            emit(chatActions.startChannel());
        });

        socket.on('login-error', () => {
            console.log('login error')
        });

        return () => { };
    });
}

function* login(socket) {
    const token = getAccessToken();
    yield socket.emit('login', {
        token
    });
}

function* read(socket) {
    const channel = yield call(subscribe, socket);
    while (true) {
        const action = yield take(channel);
        yield put(action);
    }
}

function* handleIO(socket) {
    yield fork(login, socket);
    yield fork(read, socket);
}

function* startChanelSaga() {
    try {
        yield put(chatActions.stopChannel());
        socket = yield call(connectSocket);
        yield put(chatActions.serverOn());
        socketTask = yield fork(handleIO, socket);
    } catch (e) {
        console.log(e)
    }
}

function* stopChanelSaga() {
    if (socket) {
        socket.off();
        socket.disconnect();
    }

    yield cancel(socketTask);
    yield put(chatActions.serverOff());
}

const sagas = [
    takeLatest(chatConstant.START_CHANNEL, startChanelSaga),
    takeLatest(chatConstant.STOP_CHANNEL, stopChanelSaga)
];

export default sagas;
