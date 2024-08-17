import type { GameState } from "./global";
import { State } from "./global";

export type GameHandler = (game: GameState) => void;

const toggleInterface = (nextState: State) => {
  const elements = document.querySelectorAll<HTMLButtonElement>(".home")!;
  const container = document.querySelector<HTMLButtonElement>("#game")!;
  if (nextState === State.playing) {
    for (const elem of elements) {
      elem.classList.add("hidden");
    }
    container.classList.remove("hidden");
  } else {
    for (const elem of elements) {
      elem.classList.remove("hidden");
    }
    container.classList.add("hidden");
  }
};

export const statesMapping: Record<State, State> = {
  welcome: State.waving,
  waving: State.start,
  start: State.playing,
  playing: State.welcome,
};

export const gameHandler: GameHandler = (game: GameState) => {
  const nextState = statesMapping[game.state];

  toggleInterface(nextState);
  game.state = nextState;
};
