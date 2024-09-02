import { expect, test } from "vitest";

import { MenuOptions, updateGameState } from "./core.ts";

test(`when the game is updated and Game Over, 
    then 
        state is not changed`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: true,
    youWin: false,
    player: {
      id: "Player0",
      x: 0,
      y: 0,
      radius: 5,
      speed: 120,
    },
    enemies: [{ id: "Jason0", x: 100, y: 100, radius: 5, speed: 100 }],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };
  expect(
    updateGameState(initialGameState, 0, fakeRandom, fakeUnique),
  ).toStrictEqual(initialGameState);
});

test(`when the player collides with an ennemy, 
    then 
        Game is Over`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 90,
      y: 90,
      radius: 5,
      speed: 120,
    },
    enemies: [{ id: "Jason0", x: 100, y: 100, radius: 5, speed: 100 }],
    specialAreas: [],
    directions: {
      up: false,
      down: true,
      left: false,
      right: true,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };
  const expectedGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: true,
    youWin: false,
    player: {
      id: "Player0",
      x: 95,
      y: 95,
      radius: 5,
      speed: 120,
    },
    enemies: [
      {
        id: "Jason0",
        x: 92.92893218813452,
        y: 92.92893218813452,
        radius: 5,
        speed: 100,
      },
    ],
    specialAreas: [],
    directions: {
      up: false,
      down: true,
      left: false,
      right: true,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 100,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };
  expect(
    updateGameState(initialGameState, 100, fakeRandom, fakeUnique),
  ).toStrictEqual(expectedGameState);
});

test(`when the player moves left for one frame, 
    then 
        player x position is dcreased by the player move speed (120)`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [{ id: "Jason0", x: 1000, y: 1000, radius: 5, speed: 100 }],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: true,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 380,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [
      {
        id: "Jason0",
        x: 929.2893218813452,
        y: 929.2893218813452,
        radius: 5,
        speed: 100,
      },
    ],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: true,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 1000,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  expect(
    updateGameState(initialGameState, 1000, fakeRandom, fakeUnique),
  ).toStrictEqual(expectedGameState);
});

test(`when the player moves right for one frame, 
    then 
        player x position is increased by the player move speed (120)`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [{ id: "Jason0", x: 1000, y: 1000, radius: 5, speed: 100 }],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: true,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 620,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [
      {
        id: "Jason0",
        x: 929.2893218813452,
        y: 929.2893218813452,
        radius: 5,
        speed: 100,
      },
    ],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: true,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 1000,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  expect(
    updateGameState(initialGameState, 1000, fakeRandom, fakeUnique),
  ).toStrictEqual(expectedGameState);
});

test(`when the player moves up for one frame, 
    then 
        player y position is dcreased by the player move speed (120)`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [{ id: "Jason0", x: 1000, y: 1000, radius: 5, speed: 100 }],
    specialAreas: [],
    directions: {
      up: true,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 380,
      radius: 5,
      speed: 120,
    },
    enemies: [
      {
        id: "Jason0",
        x: 929.2893218813452,
        y: 929.2893218813452,
        radius: 5,
        speed: 100,
      },
    ],
    specialAreas: [],
    directions: {
      up: true,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 1000,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  expect(
    updateGameState(initialGameState, 1000, fakeRandom, fakeUnique),
  ).toStrictEqual(expectedGameState);
});

test(`when the player moves down for one frame, 
    then 
        player y position is increased by the player move speed (120)`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [{ id: "Jason0", x: 1000, y: 1000, radius: 5, speed: 100 }],
    specialAreas: [],
    directions: {
      up: false,
      down: true,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 620,
      radius: 5,
      speed: 120,
    },
    enemies: [
      {
        id: "Jason0",
        x: 929.2893218813452,
        y: 929.2893218813452,
        radius: 5,
        speed: 100,
      },
    ],
    specialAreas: [],
    directions: {
      up: false,
      down: true,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 1000,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  expect(
    updateGameState(initialGameState, 1000, fakeRandom, fakeUnique),
  ).toStrictEqual(expectedGameState);
});

test(`when the game runs for one frame,
  then
      ennemies converge to the player position`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [
      { id: "Jason0", x: 500, y: 1000, radius: 5, speed: 100 },
      { id: "Jason1", x: 500, y: 0, radius: 5, speed: 100 },
      { id: "Jason2", x: 0, y: 500, radius: 5, speed: 100 },
      { id: "Jason3", x: 1000, y: 500, radius: 5, speed: 100 },
    ],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [
      { id: "Jason0", x: 500, y: 900, radius: 5, speed: 100 },
      { id: "Jason1", x: 500, y: 100, radius: 5, speed: 100 },
      { id: "Jason2", x: 100, y: 500, radius: 5, speed: 100 },
      { id: "Jason3", x: 900, y: 500, radius: 5, speed: 100 },
    ],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 1000,
      surprises: Array.from({ length: 13 }).map(() => ({
        id: 5,
        name: "Controls Reversed",
      })),
      currentSurprise: null,
      currentScore: 0,
    },
  };

  expect(
    updateGameState(initialGameState, 1000, fakeRandom, fakeUnique),
  ).toStrictEqual(expectedGameState);
});

test(`when the game runs for n round (each 13sec),
  then
      the event's timer counts the total time elapsed
      and the event's round keeps the current round`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 50,
      y: 50,
      radius: 5,
      speed: 120,
    },
    enemies: [{ id: "Jason0", x: 0, y: 0, radius: 5, speed: 100 }],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [
        { id: 1, name: "Holes Appear" },
        { id: 2, name: "Jason Speed Up" },
        { id: 3, name: "Player Speed Up" },
        { id: 4, name: "Player Slow Down" },
        { id: 5, name: "Controls Reversed" },
        { id: 6, name: "Slippery Floor" },
        { id: 7, name: "Sticky Floor" },
        { id: 8, name: "Arena Shape Change" },
        { id: 9, name: "Jasons to Edges" },
        { id: 10, name: "Super-Jason Appears" },
        { id: 11, name: "4 New Jasons" },
        { id: 12, name: "Double Jasons" },
        { id: 13, name: "Only Biggest Jason" },
      ],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedEventAfterOneRound = {
    ROUND_DURATION: 13_000,
    timer: 13_000,
    round: 1,
    surprises: [
      { id: 2, name: "Jason Speed Up" },
      { id: 3, name: "Player Speed Up" },
      { id: 4, name: "Player Slow Down" },
      { id: 5, name: "Controls Reversed" },
      { id: 6, name: "Slippery Floor" },
      { id: 7, name: "Sticky Floor" },
      { id: 8, name: "Arena Shape Change" },
      { id: 9, name: "Jasons to Edges" },
      { id: 10, name: "Super-Jason Appears" },
      { id: 11, name: "4 New Jasons" },
      { id: 12, name: "Double Jasons" },
      { id: 13, name: "Only Biggest Jason" },
    ],
    currentSurprise: { id: 1, name: "Holes Appear" },
    currentScore: 0,
  };
  const expectedEventAfterTwoRound = {
    ROUND_DURATION: 13_000,
    timer: 26_000,
    round: 2,
    surprises: [
      { id: 3, name: "Player Speed Up" },
      { id: 4, name: "Player Slow Down" },
      { id: 5, name: "Controls Reversed" },
      { id: 6, name: "Slippery Floor" },
      { id: 7, name: "Sticky Floor" },
      { id: 8, name: "Arena Shape Change" },
      { id: 9, name: "Jasons to Edges" },
      { id: 10, name: "Super-Jason Appears" },
      { id: 11, name: "4 New Jasons" },
      { id: 12, name: "Double Jasons" },
      { id: 13, name: "Only Biggest Jason" },
    ],
    currentSurprise: { id: 2, name: "Jason Speed Up" },
    currentScore: 0,
  };

  const gameStateAfterTheFirstRound = updateGameState(
    initialGameState,
    13_000,
    fakeRandom,
    fakeUnique,
  );
  expect(gameStateAfterTheFirstRound.event).toStrictEqual(
    expectedEventAfterOneRound,
  );

  const gameStateAfterTheSecondRound = updateGameState(
    gameStateAfterTheFirstRound,
    13_000,
    fakeRandom,
    fakeUnique,
  );
  expect(gameStateAfterTheSecondRound.event).toStrictEqual(
    expectedEventAfterTwoRound,
  );
});

test(`when the surprise "Jason Speed Up" is fired,
  then
      the speed of all the Jason is inscreased by 10`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 50,
      y: 50,
      radius: 5,
      speed: 120,
    },
    enemies: [
      { id: "Jason0", x: 0, y: 0, radius: 5, speed: 100 },
      { id: "Jason1", x: 100, y: 100, radius: 5, speed: 100 },
      { id: "Jason2", x: 100, y: 0, radius: 5, speed: 100 },
      { id: "Jason3", x: 0, y: 100, radius: 5, speed: 100 },
    ],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 2, name: "Jason Speed Up" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedEnnemiesAfterSurprise = [
    { id: "Jason0", x: 100, y: 100, radius: 5, speed: 110 },
    { id: "Jason1", x: 0, y: 0, radius: 5, speed: 110 },
    { id: "Jason2", x: 0, y: 100, radius: 5, speed: 110 },
    { id: "Jason3", x: 100, y: 0, radius: 5, speed: 110 },
  ];

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique).enemies,
  ).toStrictEqual(expectedEnnemiesAfterSurprise);
});

test(`when the surprise "Player Speed Up" is fired,
  then
      the speed of the Player is inscreased by 10`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 50,
      y: 50,
      radius: 5,
      speed: 120,
    },
    enemies: [],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 3, name: "Player Speed Up" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedPlayerAfterSurprise = {
    id: "Player0",
    x: 50,
    y: 50,
    radius: 5,
    speed: 130,
  };

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique).player,
  ).toStrictEqual(expectedPlayerAfterSurprise);
});

test(`when the surprise "Player Speed Up" is fired,
  then
      the speed of the Player is inscreased by 10`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 50,
      y: 50,
      radius: 5,
      speed: 120,
    },
    enemies: [],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 4, name: "Player Slow Down" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedPlayerAfterSurprise = {
    id: "Player0",
    x: 50,
    y: 50,
    radius: 5,
    speed: 110,
  };

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique).player,
  ).toStrictEqual(expectedPlayerAfterSurprise);
});

test(`when the surprise "Player Speed Up" is fired,
  then
      the minimum of speed for the Player is 40`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 50,
      y: 50,
      radius: 5,
      speed: 40,
    },
    enemies: [],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 4, name: "Player Slow Down" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedPlayerAfterSurprise = {
    id: "Player0",
    x: 50,
    y: 50,
    radius: 5,
    speed: 40,
  };

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique).player,
  ).toStrictEqual(expectedPlayerAfterSurprise);
});

test(`when the surprise "Only Biggest Jason" is fired,
  then
      all the Jasons except the biggest disappear`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 50,
      y: 50,
      radius: 5,
      speed: 120,
    },
    enemies: [
      { id: "Jason0", x: 0, y: 0, radius: 5, speed: 100 },
      { id: "Jason1", x: 100, y: 100, radius: 20, speed: 100 },
      { id: "Jason2", x: 100, y: 0, radius: 5, speed: 100 },
      { id: "Jason3", x: 0, y: 100, radius: 5, speed: 100 },
    ],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 13, name: "Only Biggest Jason" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedEnnemiesAfterSurprise = [
    { id: "Jason1", x: 0, y: 0, radius: 20, speed: 100 },
  ];

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique).enemies,
  ).toStrictEqual(expectedEnnemiesAfterSurprise);
});

test(`when the surprise "Only Biggest Jason" is fired and all the Jasons have the same size,
  then
      only one remains`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 50,
      y: 50,
      radius: 5,
      speed: 120,
    },
    enemies: [
      { id: "Jason0", x: 0, y: 0, radius: 5, speed: 100 },
      { id: "Jason1", x: 100, y: 100, radius: 5, speed: 100 },
      { id: "Jason2", x: 100, y: 0, radius: 5, speed: 100 },
      { id: "Jason3", x: 0, y: 100, radius: 5, speed: 100 },
    ],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 13, name: "Only Biggest Jason" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const expectedEnnemiesAfterSurprise = [
    { id: "Jason0", x: 100, y: 100, radius: 5, speed: 100 },
  ];

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique).enemies,
  ).toStrictEqual(expectedEnnemiesAfterSurprise);
});

test(`when the surprise "Controls Reversed" is fired,
  then
      controls are reversed until the surprise fires again`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 50,
      y: 50,
      radius: 5,
      speed: 120,
    },
    enemies: [],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [
        { id: 5, name: "Controls Reversed" },
        { id: 5, name: "Controls Reversed" },
      ],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  const gameStateAfterTheFirstSurprise = updateGameState(
    initialGameState,
    13_000,
    fakeRandom,
    fakeUnique,
  );
  expect(gameStateAfterTheFirstSurprise.controlsReversed).toStrictEqual(true);

  const gameStateAfterTheSecondSurprise = updateGameState(
    gameStateAfterTheFirstSurprise,
    13_000,
    fakeRandom,
    fakeUnique,
  );
  expect(gameStateAfterTheSecondSurprise.controlsReversed).toStrictEqual(false);
});

test(`when the surprise "Super-Jason Appears" is fired,
  then
      a big (radius 15) and fast (speed 90) Jason appears`, () => {
  const fakeRandom = () => 0.42;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 100, height: 100 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 50,
      y: 50,
      radius: 5,
      speed: 120,
    },
    enemies: [],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 10, name: "Super-Jason Appears" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique).enemies,
  ).toStrictEqual([{ id: "Jason42", x: 100, y: 100, radius: 15, speed: 90 }]);
});

test(`when the surprise "Holes Appear" is fired,
  then
      three holes appear not so close from the player`, () => {
  const fakeRandom = () => 0.5;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 1, name: "Holes Appear" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique)
      .specialAreas,
  ).toStrictEqual([
    { x: 600, y: 600, radius: 20, type: "hole" },
    { x: 600, y: 600, radius: 20, type: "hole" },
    { x: 600, y: 600, radius: 20, type: "hole" },
  ]);
});

test(`when the surprise "Slippery Floor" is fired,
  then
      three slippery areas appear not so close from the player`, () => {
  const fakeRandom = () => 0.4;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 6, name: "Slippery Floor" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique)
      .specialAreas,
  ).toStrictEqual([
    { x: 400, y: 400, radius: 18, type: "slippery" },
    { x: 400, y: 400, radius: 18, type: "slippery" },
    { x: 400, y: 400, radius: 18, type: "slippery" },
  ]);
});

test(`when the surprise "Sticky Floor" is fired,
  then
      three sticky areas appear not so close from the player`, () => {
  const fakeRandom = () => 0.4;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: [{ id: 7, name: "Sticky Floor" }],
      currentSurprise: null,
      currentScore: 0,
    },
  };

  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique)
      .specialAreas,
  ).toStrictEqual([
    { x: 400, y: 400, radius: 18, type: "sticky" },
    { x: 400, y: 400, radius: 18, type: "sticky" },
    { x: 400, y: 400, radius: 18, type: "sticky" },
  ]);
});

test(`when the 13th round ends, then the player wins`, () => {
  const fakeRandom = () => 0.4;
  const fakeUnique = () => 42;

  const initialGameState = {
    canvas: { width: 1000, height: 1000 },
    menu: {
      main: true,
      scores: false,
      credits: false,
      selected: "START" as MenuOptions,
      options: ["START", "HIGH SCORES", "CREDITS"] as MenuOptions[],
    },
    gameOver: false,
    youWin: false,
    player: {
      id: "Player0",
      x: 500,
      y: 500,
      radius: 5,
      speed: 120,
    },
    enemies: [],
    specialAreas: [],
    directions: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    controlsReversed: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 12,
      timer: 156_000,
      surprises: [],
      currentSurprise: null,
      currentScore: 0,
    },
  };
  expect(
    updateGameState(initialGameState, 13_000, fakeRandom, fakeUnique).youWin,
  ).toStrictEqual(true);
});
