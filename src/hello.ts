import { computeHello } from "./computeHello";

export function sayHello(element: HTMLButtonElement) {
  let shouldWave = false;
  const setWave = (wave: boolean) => {
    shouldWave = wave;
    element.innerHTML = computeHello(shouldWave);
  };
  element.addEventListener("click", () => setWave(!shouldWave));
  setWave(false);
}
