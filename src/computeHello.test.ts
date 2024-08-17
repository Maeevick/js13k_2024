import { expect, test } from "vitest";
import { computeHello } from "./computeHello";

test("when waving is expected, returns 👋", () => {
  expect(computeHello(true)).toBe("👋");
});

test("When waving is not expected, returns the instruction", () => {
  expect(computeHello(false)).toBe("Say Hello");
});
