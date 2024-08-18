import { expect, test } from "vitest";

import { createInitialState } from "./index.ts";

test(`when the game is initialized with a canvas of 100px * 100px, 
    then 
        the canvas is correct, 
        the player 10px wide is at the center 50:50
        the game is not Game Over
        the key are not pressed
        and enemies are positionned accordingly to the randomizer function`, () => {
  const expectedCanvas = { width: 100, height: 100 };
  const expectedEnnemies = [
    { x: 42, y: 42 },
    { x: 42, y: 42 },
    { x: 42, y: 42 },
    { x: 42, y: 42 },
    { x: 42, y: 42 },
  ];
  const expectedGameOverState = false;
  const expectedKeysState = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };
  const expectedPlayer = {
    radius: 5,
    x: 50,
    y: 50,
  };
  expect(createInitialState(100, 100, () => 0.42)).toStrictEqual({
    canvas: expectedCanvas,
    enemies: expectedEnnemies,
    gameOver: expectedGameOverState,
    keys: expectedKeysState,
    player: expectedPlayer,
  });
});
