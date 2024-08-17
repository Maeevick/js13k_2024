import { expect, test } from "vitest";

import { State } from "./global.ts";
import { computeMessage } from "./computeMessage.ts";

test("when the user is at the begining of the cycle the state is 'welcome', returns 'Say Hello'", () => {
  expect(computeMessage(State.welcome)).toBe("Say Hello");
});

test("when the user has 'Said Hello', the next state is 'waving', returns 'Waving Hand'", () => {
  expect(computeMessage(State.waving)).toBe("👋");
});

test("when the user has 'Waved', the next state is 'start', returns 'Start'", () => {
  expect(computeMessage(State.start)).toBe("Start");
});
