export const MUSIC_PLAY = "MUSIC_PLAY";
export const SOUND_PLAY = "SOUND_PLAY";

export interface SettingsState {
  isMusicPlay: boolean;
  isSoundPlay: boolean;
}

interface SettingsAction {
  type: string;
  payload: any;
}

const initialState: any = {
  isMusicPlay: false,
  isSoundPlay: false,
};

const settingsReducer = (
  state: SettingsState = initialState,
  action: SettingsAction
): any => {
  switch (action.type) {
    case MUSIC_PLAY:
      return {
        ...state,
        isMusicPlay: action.payload,
      };

    case SOUND_PLAY:
      return {
        ...state,
        isSoundPlay: action.payload,
      };

    default:
      return state;
  }
};

export default settingsReducer;
