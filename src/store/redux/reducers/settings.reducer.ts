export const AUDIO_PLAY = "AUDIO_PLAY";

export interface SettingsState {
  isAudioPlay: boolean;
}

interface SettingsAction {
  type: string;
  payload: any;
}

const initialState: any = {
  isAudioPlay: false,
};

const settingsReducer = (
  state: any = initialState,
  action: SettingsAction
): any => {
  switch (action.type) {
    case AUDIO_PLAY:
      return {
        isAudioPlay: action.payload,
      };

    default:
      return state;
  }
};

export default settingsReducer;
