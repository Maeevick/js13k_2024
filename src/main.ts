import "./style.css";

import { GameState, State } from "./global.ts";

import { render } from "./render.ts";
import { gameHandler } from "./game.ts";

declare global {
  interface Window {
    _: {
      game: GameState;
    };
  }
}

window._ = {
  game: {
    state: State.welcome,
  },
};

const game: GameState = window._.game;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a class="home" href="https://maeevick.substack.com/s/microgame-maker-en-edition" target="_blank">
      <img src="" class="logo" alt="Follow my MicroGame Maker journey" />
    </a>
    <h1 class="home">JS13K - 2024</h1>
    <h2 class="">🎮 Work in Progress - Codename ???</h2>
    <div class="card home">
      <button id="hello" type="button"></button>
    </div>
    <div id="game" class="hidden">
      <canvas id="canvas"></canvas>
    </div>
    <a class="link home" href="https://js13kgames.com/" target="_blank">
      <img src="" class="logo" alt="What's JS13K" />
    </a>
  </div>
`;

render(game, document.querySelector<HTMLButtonElement>("#hello")!, gameHandler);
