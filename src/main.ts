import "./style.css";
import { sayHello } from "./hello.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://maeevick.substack.com/s/microgame-maker-en-edition" target="_blank">
      <img src="" class="logo" alt="Follow my MicroGame Maker journey" />
    </a>
    <h1>JS13K - 2024</h1>
    <div class="card">
      <button id="hello" type="button"></button>
    </div>
    <a href="https://js13kgames.com/" target="_blank">
      <img src="" class="logo" alt="What's JS13K" />
    </a>
  </div>
`;

sayHello(document.querySelector<HTMLButtonElement>("#hello")!);
