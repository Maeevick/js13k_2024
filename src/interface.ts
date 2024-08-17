import { GameState, State } from "./global.ts";
import { computeMessage } from "./computeMessage.ts";

import { Game } from "./game.ts";

const statesMapping: Record<State, State> = {
  welcome: State.waving,
  waving: State.start,
  start: State.playing,
  playing: State.welcome,
};

const toggleInterface = (nextState: State): void => {
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

export const render = (game: GameState, element: HTMLButtonElement): void => {
  const setMessage = (current: State) => {
    const msg = computeMessage(current);

    element.innerHTML = msg;
  };

  setMessage(game.state);

  element.addEventListener("click", () => {
    const nextState = statesMapping[game.state];
    toggleInterface(nextState);
    game.state = nextState;

    if (nextState === State.playing) {
      new Game().start();
    }
    setMessage(nextState);
  });
};
