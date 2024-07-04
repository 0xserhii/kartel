import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import chatReducer from './chat.reducer';
import paymentReducer from './payment.reducer';
import leaderboardReducer from './leaderboard.reducer';
import coinflipReducer from './coinflip.reducer';
import modalReducer from './modal.reducer';
import userReducer from './user.reducer';
import minesReducer from './mines.reducer';
import settingsReducer from './settings.reducer';


const userPersistConfig = {
  key: 'user',
  storage: storage,
  transforms: [
    encryptTransform({
      secretKey: 'P3FYdhTukOmjClrRZ1ywV56zW2vzzltPm4DZmnZnsrM=',
    }),
  ],
};

const settingsPersistConfig = {
  key: 'settings',
  storage: storage,
  transforms: [
    encryptTransform({
      secretKey: 'P3FYdhTukOmjClrRZ1ywV56zW2vzzltPm4DZmnZnsrM=',
    }),
  ],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  settings: persistReducer(settingsPersistConfig, settingsReducer),
  chat: chatReducer,
  payment: paymentReducer,
  leaderboard: leaderboardReducer,
  coinflip: coinflipReducer,
  mines: minesReducer,
  modal: modalReducer
});

export default rootReducer