import { takeLatest, put } from 'redux-saga/effects';

function* setModalAsync(action) {
  yield put({ type: 'SET_MODAL', payload: action.payload });
}

function* modalSaga() {
  yield takeLatest('SET_MODAL_ASYNC', setModalAsync);
}

export default modalSaga;
