import { MUSIC_PLAY, SOUND_PLAY } from "../reducers/settings.reducer";

export function musicPlay(music: boolean) {
  return {
    type: MUSIC_PLAY,
    payload: music,
  };
}

export function soundPlay(sound) {
  return {
    type: SOUND_PLAY,
    payload: sound,
  };
}
