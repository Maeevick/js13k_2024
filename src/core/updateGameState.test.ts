import { expect, test } from "vitest";

import { updateGameState } from "./index.ts";

test(`when the game is updated and Game Over, 
    then 
        state is not changed`, () => {
  const initialGameState = {
    canvas: { width: 100, height: 100 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: true,
    player: {
      x: 0,
      y: 0,
      radius: 5,
    },
    enemies: [{ x: 100, y: 100 }],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
  };
  expect(updateGameState(initialGameState, 0)).toStrictEqual(initialGameState);
});

test(`when the player collides with an ennemy, 
    then 
        Game is Over`, () => {
  const initialGameState = {
    canvas: { width: 100, height: 100 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: false,
    player: {
      x: 90,
      y: 90,
      radius: 5,
    },
    enemies: [{ x: 100, y: 100 }],
    directions: {
      up: false,
      down: true,
      left: false,
      right: true,
    },
  };
  const expectedGameState = {
    canvas: { width: 100, height: 100 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: true,
    player: {
      x: 95,
      y: 95,
      radius: 5,
    },
    enemies: [{ x: 100, y: 100 }],
    directions: {
      up: false,
      down: true,
      left: false,
      right: true,
    },
  };
  expect(updateGameState(initialGameState, 100)).toStrictEqual(
    expectedGameState,
  );
});

test(`when the player moves left for one frame, 
    then 
        player x position is dcreased by the player move speed (120)`, () => {
  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: false,
    player: {
      x: 500,
      y: 500,
      radius: 5,
    },
    enemies: [{ x: 1000, y: 1000 }],
    directions: {
      up: false,
      down: false,
      left: true,
      right: false,
    },
  };

  const expectedGameState = {
    canvas: { width: 1000, height: 1000 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: false,
    player: {
      x: 380,
      y: 500,
      radius: 5,
    },
    enemies: [{ x: 1000, y: 1000 }],
    directions: {
      up: false,
      down: false,
      left: true,
      right: false,
    },
  };

  expect(updateGameState(initialGameState, 1000)).toStrictEqual(
    expectedGameState,
  );
});

test(`when the player moves right for one frame, 
    then 
        player x position is increased by the player move speed (120)`, () => {
  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: false,
    player: {
      x: 500,
      y: 500,
      radius: 5,
    },
    enemies: [{ x: 1000, y: 1000 }],
    directions: {
      up: false,
      down: false,
      left: false,
      right: true,
    },
  };

  const expectedGameState = {
    canvas: { width: 1000, height: 1000 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: false,
    player: {
      x: 620,
      y: 500,
      radius: 5,
    },
    enemies: [{ x: 1000, y: 1000 }],
    directions: {
      up: false,
      down: false,
      left: false,
      right: true,
    },
  };

  expect(updateGameState(initialGameState, 1000)).toStrictEqual(
    expectedGameState,
  );
});

test(`when the player moves up for one frame, 
    then 
        player y position is dcreased by the player move speed (120)`, () => {
  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: false,
    player: {
      x: 500,
      y: 500,
      radius: 5,
    },
    enemies: [{ x: 1000, y: 1000 }],
    directions: {
      up: true,
      down: false,
      left: false,
      right: false,
    },
  };

  const expectedGameState = {
    canvas: { width: 1000, height: 1000 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: false,
    player: {
      x: 500,
      y: 380,
      radius: 5,
    },
    enemies: [{ x: 1000, y: 1000 }],
    directions: {
      up: true,
      down: false,
      left: false,
      right: false,
    },
  };

  expect(updateGameState(initialGameState, 1000)).toStrictEqual(
    expectedGameState,
  );
});

test(`when the player moves down for one frame, 
    then 
        player y position is increased by the player move speed (120)`, () => {
  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: false,
    player: {
      x: 500,
      y: 500,
      radius: 5,
    },
    enemies: [{ x: 1000, y: 1000 }],
    directions: {
      up: false,
      down: true,
      left: false,
      right: false,
    },
  };

  const expectedGameState = {
    canvas: { width: 1000, height: 1000 },
    joystick: { x: 80, y: 80, radius: 10 },
    gameOver: false,
    player: {
      x: 500,
      y: 620,
      radius: 5,
    },
    enemies: [{ x: 1000, y: 1000 }],
    directions: {
      up: false,
      down: true,
      left: false,
      right: false,
    },
  };

  expect(updateGameState(initialGameState, 1000)).toStrictEqual(
    expectedGameState,
  );
});
