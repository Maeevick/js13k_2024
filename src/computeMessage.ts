import { State } from "./global";

const messagesMapping: Record<State, string> = {
  welcome: "Say Hello",
  waving: "👋",
  start: "Start",
  playing: "",
};

export const computeMessage = (state: State) => {
  return messagesMapping[state];
};
