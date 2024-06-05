
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
    takeEvery,
    delay
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
            console.log('disconnect chat event')
            emit(chatActions.disconnectChatServer());
        });

        socket.on(EChatSocketEvent.RECEIVE_CHAT_HISTORY, (history: {
            message: string;
            chatHistories: IChat[];
        }) => {
            emit(chatActions.receiveChatHistory(history.chatHistories));
        });

        return () => { };
    });
}

function* getChatHistory(socket) {
    yield call([socket, socket.emit], EChatSocketEvent.GET_CHAT_HISTORY);
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

function* getChatHistorySaga() {
    try {
        yield delay(100);
        yield fork(getChatHistory, KartelSocket.chat);
    } catch (error) {
        console.log(error)
    }
}

function* subscribeSaga() {
    try {
        yield fork(read, KartelSocket.chat);
        yield delay(100);
        yield fork(getChatHistory, KartelSocket.chat);
    } catch (error) {
        console.log(error)
    }
}

function* loginChanelSaga() {
    try {
        yield delay(500);
        socketTask = yield fork(login, KartelSocket.chat);
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
    yield delay(1000);
    KartelSocket.chat.emit(EChatSocketEvent.SEND_MSG, action.payload)
}

const sagas = [
    takeLatest(EChatSocketAction.SUBSCRIBE_CHAT, subscribeSaga),
    takeLatest(EChatSocketAction.LOGIN_CHAT, loginChanelSaga),
    takeLatest(EChatSocketAction.GET_CHAT_HISTORY, getChatHistorySaga),
    takeLatest(EChatSocketAction.DISCONNECT_CHAT, stopChanelSaga),
    takeEvery(EChatSocketAction.SEND_MSG, sendMsgSaga),
];

export default sagas;
