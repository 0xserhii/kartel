
import {
    eventChannel
} from 'redux-saga';

import {
    put,
    call,
    fork,
    take,
    cancel,
    takeLatest,
    takeEvery
} from 'redux-saga/effects';

import { chatActions } from '../actions';
import { getAccessToken } from '@/lib/axios';
import KartelSocket from '@/lib/socket-service';
import { EChatSocketEvent, IChat } from '@/types';
import { EChatSocketAction } from '../reducers/chat.type';


let socketTask;

function subscribe(socket) {
    return eventChannel(emit => {
        socket.on(EChatSocketEvent.RECEIVE_MSG, (msg: IChat) => {
            emit(chatActions.receiveMsg(msg));
        });

        socket.on(EChatSocketEvent.DISCONNECT_CHAT, () => {
            emit(chatActions.disconnectChatServer());
        });

        socket.on(EChatSocketEvent.GET_CHAT_HISTORY, (history: IChat[]) => {
            emit(chatActions.getChatHistory(history));
        });

        return () => { };
    });
}

function* login(socket) {
    const token = getAccessToken();
    yield call([socket, socket.emit], EChatSocketEvent.LOGIN, token);
}

function* read(socket) {
    const channel = yield call(subscribe, socket);
    while (true) {
        const action = yield take(channel);
        yield put(action);
    }
}

function* handleIO(socket) {
    yield fork(read, socket);
    yield fork(login, socket);
}

function* startChanelSaga() {
    try {
        socketTask = yield fork(handleIO, KartelSocket.chat);
    } catch (e) {
        console.log(e)
    }
}

function* stopChanelSaga() {
    if (KartelSocket.chat) {
        KartelSocket.chat.off();
        KartelSocket.chat.disconnect();
    }

    yield cancel(socketTask);
}

function* sendMsgSaga(action) {
    KartelSocket.chat.emit(EChatSocketEvent.SEND_MSG, action.payload)
}

const sagas = [
    takeLatest(EChatSocketAction.LOGIN_CHAT, startChanelSaga),
    takeLatest(EChatSocketAction.DISCONNECT_CHAT, stopChanelSaga),
    takeEvery(EChatSocketAction.SEND_MSG, sendMsgSaga),
];

export default sagas;
