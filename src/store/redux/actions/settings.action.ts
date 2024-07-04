import { AUDIO_PLAY } from "../reducers/settings.reducer";

export function audioPlay(audio) {
  return {
    type: AUDIO_PLAY,
    payload: audio,
  };
}
