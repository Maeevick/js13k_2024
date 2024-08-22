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
    { id: "Jason0", x: 42, y: 42, radius: 5, speed: 60 },
    { id: "Jason1", x: 42, y: 42, radius: 5, speed: 60 },
    { id: "Jason2", x: 42, y: 42, radius: 5, speed: 60 },
    { id: "Jason3", x: 42, y: 42, radius: 5, speed: 60 },
    { id: "Jason4", x: 42, y: 42, radius: 5, speed: 60 },
  ];
  const expectedGameOverState = false;
  const expectedDirections = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  const expectedPlayer = {
    id: "Player0",
    radius: 5,
    speed: 120,
    x: 50,
    y: 50,
  };
  const expectedJoystick = {
    x: 30,
    y: 30,
    radius: 50,
  };
  expect(createInitialState(100, 100, () => 0.42)).toStrictEqual({
    canvas: expectedCanvas,
    joystick: expectedJoystick,
    enemies: expectedEnnemies,
    gameOver: expectedGameOverState,
    directions: expectedDirections,
    player: expectedPlayer,
  });
});
