import {
    all
} from 'redux-saga/effects';

import chatSagas from './chat.saga';

export default function* rootSaga() {
    yield all([
        ...chatSagas,
    ]);
}
