export function sayHello(element: HTMLButtonElement) {
  let isWaving = false;
  const setWave = (wave: boolean) => {
    isWaving = wave;
    element.innerHTML = `${isWaving ? "👋" : "Hello you!"}`;
  };
  element.addEventListener("click", () => setWave(!isWaving));
  setWave(false);
}
