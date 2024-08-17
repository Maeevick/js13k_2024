export enum State {
  welcome = "welcome",
  waving = "waving",
  start = "start",
  playing = "playing",
}

export type GameState = {
  state: State;
};
