import { expect, test } from "vitest";

import { createInitialState } from "./core.ts";

test(`when the game is initialized with a canvas of 100px * 100px, 
    then 
        the canvas is correct, 
        the player 1000units wide is at the center 500:500
        the game is not Game Over
        the key are not pressed
        and enemies are positionned accordingly to the randomizer function`, () => {
  const expectedCanvas = { width: 1000, height: 1000 };
  const expectedEnnemies = [
    { id: "Jason0", x: 320, y: 320, radius: 5, speed: 60 },
    { id: "Jason1", x: 320, y: 320, radius: 5, speed: 60 },
    { id: "Jason2", x: 320, y: 320, radius: 5, speed: 60 },
    { id: "Jason3", x: 320, y: 320, radius: 5, speed: 60 },
    { id: "Jason4", x: 320, y: 320, radius: 5, speed: 60 },
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
    x: 500,
    y: 500,
  };
  const expectedJoystick = {
    x: 930,
    y: 930,
    radius: 50,
  };
  const expectedEvent = {
    ROUND_DURATION: 13_000,
    round: 0,
    timer: 0,
  };
  expect(createInitialState(1000, 1000, () => 0.32)).toStrictEqual({
    canvas: expectedCanvas,
    joystick: expectedJoystick,
    enemies: expectedEnnemies,
    gameOver: expectedGameOverState,
    directions: expectedDirections,
    player: expectedPlayer,
    event: expectedEvent,
  });
});

test(`when the game is initialized
    then
      no enemy is in a square of 100 units from the player`, () => {
  const expectedEnnemiesPushedToTopLeft = [
    { id: "Jason0", x: 400, y: 400, radius: 5, speed: 60 },
    { id: "Jason1", x: 400, y: 400, radius: 5, speed: 60 },
    { id: "Jason2", x: 400, y: 400, radius: 5, speed: 60 },
    { id: "Jason3", x: 400, y: 400, radius: 5, speed: 60 },
    { id: "Jason4", x: 400, y: 400, radius: 5, speed: 60 },
  ];

  const expectedEnnemiesPushedToBottomRight = [
    { id: "Jason0", x: 600, y: 600, radius: 5, speed: 60 },
    { id: "Jason1", x: 600, y: 600, radius: 5, speed: 60 },
    { id: "Jason2", x: 600, y: 600, radius: 5, speed: 60 },
    { id: "Jason3", x: 600, y: 600, radius: 5, speed: 60 },
    { id: "Jason4", x: 600, y: 600, radius: 5, speed: 60 },
  ];

  const expectedEnnemiesPushedToTheEdgeTopLeft = [
    { id: "Jason0", x: 0, y: 0, radius: 5, speed: 60 },
    { id: "Jason1", x: 0, y: 0, radius: 5, speed: 60 },
    { id: "Jason2", x: 0, y: 0, radius: 5, speed: 60 },
    { id: "Jason3", x: 0, y: 0, radius: 5, speed: 60 },
    { id: "Jason4", x: 0, y: 0, radius: 5, speed: 60 },
  ];

  const expectedEnnemiesPushedToTheEdgeBottomRight = [
    { id: "Jason0", x: 100, y: 100, radius: 5, speed: 60 },
    { id: "Jason1", x: 100, y: 100, radius: 5, speed: 60 },
    { id: "Jason2", x: 100, y: 100, radius: 5, speed: 60 },
    { id: "Jason3", x: 100, y: 100, radius: 5, speed: 60 },
    { id: "Jason4", x: 100, y: 100, radius: 5, speed: 60 },
  ];

  expect(createInitialState(1000, 1000, () => 0.49).enemies).toStrictEqual(
    expectedEnnemiesPushedToTopLeft,
  );
  expect(createInitialState(1000, 1000, () => 0.51).enemies).toStrictEqual(
    expectedEnnemiesPushedToBottomRight,
  );
  expect(createInitialState(100, 100, () => 0.49).enemies).toStrictEqual(
    expectedEnnemiesPushedToTheEdgeTopLeft,
  );
  expect(createInitialState(100, 100, () => 0.51).enemies).toStrictEqual(
    expectedEnnemiesPushedToTheEdgeBottomRight,
  );
});
