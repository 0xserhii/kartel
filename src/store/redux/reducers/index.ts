import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import chatReducer from "./chat.reducer";
import paymentReducer from "./payment.reducer";
import leaderboardReducer from "./leaderboard.reducer";
import dashboardReducer from "./dashboard.reducer";
import coinflipReducer from "./coinflip.reducer";
import modalReducer from "./modal.reducer";
import userReducer from "./user.reducer";
import minesReducer from "./mines.reducer";
import settingsReducer from "./settings.reducer";

const userPersistConfig = {
  key: "user",
  storage: storage,
  transforms: [
    encryptTransform({
      secretKey: "vf4Boy2WT1bVgphxFqjEY2GjciChkXvf4Boy2WT1hkXv2",
    }),
  ],
};

const settingsPersistConfig = {
  key: "settings",
  storage: storage,
  transforms: [
    encryptTransform({
      secretKey: "b0d2a26bac7234cd9d55c1f87a6f636581f6b",
    }),
  ],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  settings: persistReducer(settingsPersistConfig, settingsReducer),
  chat: chatReducer,
  payment: paymentReducer,
  leaderboard: leaderboardReducer,
  dashboard: dashboardReducer,
  coinflip: coinflipReducer,
  mines: minesReducer,
  modal: modalReducer,
});

export default rootReducer;
