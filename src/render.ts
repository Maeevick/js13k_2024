import type { GameHandler } from "./game.ts";

import { GameState, State } from "./global.ts";
import { computeMessage } from "./computeMessage.ts";

export function render(
  game: GameState,
  element: HTMLButtonElement,
  gameHandler: GameHandler,
) {
  const setMessage = (current: State) => {
    const msg = computeMessage(current);

    element.innerHTML = msg;
  };

  setMessage(game.state);

  element.addEventListener("click", () => {
    gameHandler(game);
    setMessage(game.state);
  });
}
