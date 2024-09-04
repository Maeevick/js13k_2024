import { expect, test } from "vitest";

import { createInitialState } from "./core.ts";

test(`when the game is initialized with a canvas of 100px * 100px, 
    then 
        the canvas is correct, 
        the player 10units wide is at the center 500:500
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
  const expectedEvent = {
    ROUND_DURATION: 13_000,
    round: 0,
    timer: 0,
    surprises: Array.from({ length: 13 }).map(() => ({
      id: 5,
      name: "Controls Reversed",
    })),
    currentSurprise: null,
  };
  const expectedScore = {
    current: 0,
    enterSpecialArea: false,
    enterDodgeArea: false,
    highScores: [],
  };
  expect(createInitialState(1000, 1000, [], () => 0.32)).toStrictEqual({
    canvas: expectedCanvas,
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START",
      options: ["START", "HIGH SCORES", "CREDITS"],
    },
    enemies: expectedEnnemies,
    specialAreas: [],
    gameOver: false,
    youWin: false,
    directions: expectedDirections,
    controlsReversed: false,
    player: expectedPlayer,
    event: expectedEvent,
    score: expectedScore,
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

  expect(createInitialState(1000, 1000, [], () => 0.49).enemies).toStrictEqual(
    expectedEnnemiesPushedToTopLeft,
  );
  expect(createInitialState(1000, 1000, [], () => 0.51).enemies).toStrictEqual(
    expectedEnnemiesPushedToBottomRight,
  );
  expect(createInitialState(100, 100, [], () => 0.49).enemies).toStrictEqual(
    expectedEnnemiesPushedToTheEdgeTopLeft,
  );
  expect(createInitialState(100, 100, [], () => 0.51).enemies).toStrictEqual(
    expectedEnnemiesPushedToTheEdgeBottomRight,
  );
});

test(`when the game is initialized
  then
    the event's surprises are setup`, () => {
  expect(
    createInitialState(100, 100, [], () => 0).event.surprises.length,
  ).toStrictEqual(13);

  expect(
    createInitialState(100, 100, [], () => 0 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 1,
    name: "Holes Appear",
  });

  expect(
    createInitialState(100, 100, [], () => 1 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 2,
    name: "Jason Speed Up",
  });

  expect(
    createInitialState(100, 100, [], () => 2 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 3,
    name: "Player Speed Up",
  });

  expect(
    createInitialState(100, 100, [], () => 3 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 4,
    name: "Player Slow Down",
  });

  expect(
    createInitialState(100, 100, [], () => 4 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 5,
    name: "Controls Reversed",
  });

  expect(
    createInitialState(100, 100, [], () => 5 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 6,
    name: "Slippery Floor",
  });

  expect(
    createInitialState(100, 100, [], () => 6 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 7,
    name: "Sticky Floor",
  });

  expect(
    createInitialState(100, 100, [], () => 7 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 8,
    name: "Arena Shape Change",
  });

  expect(
    createInitialState(100, 100, [], () => 8 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 9,
    name: "Jasons to Edges",
  });

  expect(
    createInitialState(100, 100, [], () => 9 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 10,
    name: "Super-Jason Appears",
  });

  expect(
    createInitialState(100, 100, [], () => 10 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 11,
    name: "4 New Jasons",
  });

  expect(
    createInitialState(100, 100, [], () => 11 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 12,
    name: "Double Jasons",
  });

  expect(
    createInitialState(100, 100, [], () => 12 / 13).event.surprises[0],
  ).toStrictEqual({
    id: 13,
    name: "Only Biggest Jason",
  });
});
