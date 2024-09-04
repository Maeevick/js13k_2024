export type Player = {
  id: string;
  x: number;
  y: number;
  radius: number;
  speed: number;
};

export type Enemy = {
  id: string;
  x: number;
  y: number;
  radius: number;
  speed: number;
};

export type Surprise = {
  id: number;
  name: string;
};

export type SpecialArea = {
  x: number;
  y: number;
  radius: number;
  type: "hole" | "slippery" | "sticky";
};

export type MenuOptions = "START" | "HIGH SCORES" | "CREDITS";

export type GameState = {
  canvas: { width: number; height: number };
  player: Player;
  enemies: Enemy[];
  specialAreas: SpecialArea[];
  directions: { [key: string]: boolean };
  controlsReversed: boolean;
  menu: {
    main: boolean;
    scores: boolean;
    credits: boolean;
    selected: MenuOptions;
    options: MenuOptions[];
  };
  gameOver: boolean;
  youWin: boolean;
  event: {
    ROUND_DURATION: number;
    round: number;
    timer: number;
    surprises: Surprise[];
    currentSurprise: Surprise | null;
  };
  score: {
    current: number;
    enterSpecialArea: boolean;
    enterDodgeArea: boolean;
    highScores: string[];
  };
};

type Position = { x: number; y: number };

export const INITIAL_HIGH_SCORES: string[] = [
  "AAA: 13.000",
  "BBB: 12.999",
  "CCC: 9.999",
  "DDD: 7.777",
  "EEE: 6.666",
  "FFF: 5.555",
  "GGG: 4.444",
  "HHH: 42",
  "III: 4",
  "JJJ: 1",
];

const SURPRISES: Surprise[] = [
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
];

export const CREDITS: string[] = [
  "GAME MAKER: MAEEVICK",
  "",
  "SPECIAL THANKS TO:",
  "JS13K",
  "JOHN DOE",
  "JOHN DOE",
  "JOHN DOE",
  "JOHN DOE",
  "JOHN DOE",
  "JOHN DOE",
  "AND MANY MORE...",
];

export const createInitialState = (
  canvasWidth: number,
  canvasHeight: number,
  highScores: string[],
  random: () => number,
  showMainMenu = true,
): GameState => {
  const player = {
    id: "Player0",
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    radius: 5,
    speed: 120,
  };

  return {
    canvas: { width: canvasWidth, height: canvasHeight },
    player,
    enemies: Array.from({ length: 5 }, (_, i) => {
      const { x, y } = createSafePosition(
        { width: canvasWidth, height: canvasHeight },
        { x: player.x, y: player.y },
        random,
      );

      return {
        id: `Jason${i}`,
        x,
        y,
        radius: 5,
        speed: 60,
      };
    }),
    specialAreas: [],
    directions: {
      left: false,
      right: false,
      up: false,
      down: false,
    },
    controlsReversed: false,
    menu: {
      main: showMainMenu,
      scores: false,
      credits: false,
      selected: "START",
      options: ["START", "HIGH SCORES", "CREDITS"],
    },
    gameOver: false,
    youWin: false,
    event: {
      ROUND_DURATION: 13_000,
      round: 0,
      timer: 0,
      surprises: Array.from(
        { length: 13 },
        () =>
          SURPRISES[
            Math.max(
              0,
              Math.min(SURPRISES.length - 1, Math.floor(random() * 13)),
            )
          ],
      ),
      currentSurprise: null,
    },
    score: {
      current: 0,
      enterSpecialArea: false,
      enterDodgeArea: false,
      highScores,
    },
  };
};

const createSafePosition = (
  canvas: { width: number; height: number },
  player: { x: number; y: number },
  random: () => number,
): Position => {
  let x = random() * canvas.width;
  let y = random() * canvas.height;

  const dx = x - player.x || 1;
  const dy = y - player.y || 1;

  if (Math.abs(dx) < 100) {
    x = Math.max(
      0,
      Math.min(canvas.width, player.x + Math.abs(dx) * (100 / dx)),
    );
  }

  if (Math.abs(dy) < 100) {
    y = Math.max(
      0,
      Math.min(canvas.height, player.y + Math.abs(dy) * (100 / dy)),
    );
  }

  return { x, y };
};

export const updateGameState = (
  state: GameState,
  deltaTime: number,
  random: () => number,
  unique: () => number,
): GameState => {
  if (state.gameOver) return state;

  return checkCollisions(
    updatePlayerPosition(
      checkEnemyCollisions(
        updateEnemyPositions(
          updateEvent(state, deltaTime, random, unique),
          deltaTime,
        ),
        unique,
      ),
      deltaTime,
    ),
  );
};

const updatePlayerPosition = (
  state: GameState,
  deltaTime: number,
): GameState => {
  const { player, directions, canvas, controlsReversed, score } = state;

  let moveDistance = player.speed * (deltaTime / 1000);
  const affectingArea = state.specialAreas.find((area) =>
    isColliding(state.player, area),
  );

  if (affectingArea) {
    switch (affectingArea.type) {
      case "hole":
        return {
          ...state,
          gameOver: true,
        };
      case "slippery":
        moveDistance *= 2;
        score.enterSpecialArea = true;
        break;
      case "sticky":
        moveDistance *= 0.2;
        score.enterSpecialArea = true;
        break;
    }
  }

  if (!affectingArea && score.enterSpecialArea) {
    score.current += 10;
    score.enterSpecialArea = false;
  }

  const isLeft = controlsReversed ? !directions.left : directions.left;
  const isRight = controlsReversed ? !directions.right : directions.right;

  const newX = isLeft
    ? Math.max(player.radius, player.x - moveDistance)
    : isRight
      ? Math.min(canvas.width - player.radius, player.x + moveDistance)
      : player.x;

  const isUp = controlsReversed ? !directions.up : directions.up;
  const isDown = controlsReversed ? !directions.down : directions.down;

  const newY = isUp
    ? Math.max(player.radius, player.y - moveDistance)
    : isDown
      ? Math.min(canvas.height - player.radius, player.y + moveDistance)
      : player.y;

  return {
    ...state,
    player: { ...player, x: newX, y: newY },
    score: { ...score },
  };
};

const updateEnemyPositions = (
  state: GameState,
  deltaTime: number,
): GameState => {
  const { player, enemies, canvas, score } = state;

  let bonusScore = 0;

  const newEnemies = enemies
    .map((enemy) => {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let moveDistance = (enemy.speed * (deltaTime / 1000)) / distance;

      const affectingArea = state.specialAreas.find((area) =>
        isColliding(enemy, area),
      );

      if (affectingArea) {
        switch (affectingArea.type) {
          case "hole":
            bonusScore += (100 * enemy.radius) / 5;
            return null;
          case "slippery":
            moveDistance *= 2;
            break;
          case "sticky":
            moveDistance *= 0.2;
            break;
        }
      }

      const newX = enemy.x + dx * moveDistance;
      const newY = enemy.y + dy * moveDistance;

      return {
        id: enemy.id,
        x: Math.max(0, Math.min(canvas.width, newX)),
        y: Math.max(0, Math.min(canvas.height, newY)),
        radius: enemy.radius,
        speed: enemy.speed,
      };
    })
    .filter((enemy) => !!enemy);

  return {
    ...state,
    enemies: newEnemies,
    score: {
      ...score,
      current: score.current + bonusScore,
    },
  };
};

const updateEvent = (
  state: GameState,
  deltaTime: number,
  random: () => number,
  unique: () => number,
): GameState => {
  const timer = state.event.timer + deltaTime;
  const round = Math.floor(timer / state.event.ROUND_DURATION);
  const current =
    state.score.current +
    (Math.floor(timer / 1000) - Math.floor(state.event.timer / 1000));

  if (round > 12) {
    return {
      ...state,
      youWin: true,
      gameOver: true,
      score: { ...state.score, current: state.score.current + 1000 },
    };
  }

  let updatedState = {
    ...state,
    event: {
      ...state.event,
      timer,
      round,
    },
    score: {
      ...state.score,
      current,
    },
  };

  if (state.event.surprises.length > 0 && round > state.event.round) {
    updatedState = handleSurpriseAction(
      updatedState,
      state.event.surprises[0].id,
      random,
      unique,
    );
    updatedState.event = {
      ...updatedState.event,
      currentSurprise: state.event.surprises[0],
      surprises: state.event.surprises.slice(1),
    };

    updatedState.score = {
      ...updatedState.score,
      current: updatedState.score.current + 100 * (state.event.round + 1),
    };
  }

  return { ...updatedState };
};

const checkCollisions = (state: GameState): GameState => {
  const { player, enemies, score } = state;

  const collision = enemies.some((enemy) => isColliding(player, enemy));
  if (collision) {
    return { ...state, gameOver: true };
  }

  const dodges = enemies.some((enemy) => isDodging(player, enemy));
  if (dodges && !state.score.enterDodgeArea) {
    return { ...state, score: { ...score, enterDodgeArea: true } };
  }

  if (!dodges && state.score.enterDodgeArea) {
    return {
      ...state,
      score: { ...score, enterDodgeArea: false, current: score.current + 100 },
    };
  }

  return state;
};

const checkEnemyCollisions = (
  state: GameState,
  unique: () => number,
): GameState => {
  const { enemies } = state;
  const result = enemies.reduce<{
    overlappingEnemies: Set<string>;
    newEnemies: Set<GameState["enemies"][number]>;
  }>(
    (acc, enemy, i) => {
      if (acc.overlappingEnemies.has(enemy.id)) {
        return acc;
      }

      const overlappingEnemies = enemies.filter(
        (e, j) => i < j && isColliding(enemy, e),
      );
      if (overlappingEnemies.length === 0) {
        acc.newEnemies.add(enemy);
        return acc;
      }

      const mergedEnemy = {
        id: `Jason${unique()}`,
        x:
          (enemy.x + overlappingEnemies.reduce((x, e) => x + e.x, 0)) /
          (overlappingEnemies.length + 1),
        y:
          (enemy.y + overlappingEnemies.reduce((y, e) => y + e.y, 0)) /
          (overlappingEnemies.length + 1),
        radius:
          enemy.radius + overlappingEnemies.reduce((r, e) => r + e.radius, 0),
        speed: enemy.speed + 10 * overlappingEnemies.length,
      };
      acc.newEnemies.add(mergedEnemy);
      acc.overlappingEnemies.add(enemy.id);
      overlappingEnemies.forEach((e) => acc.overlappingEnemies.add(e.id));
      return acc;
    },
    {
      overlappingEnemies: new Set<string>(),
      newEnemies: new Set<GameState["enemies"][number]>(),
    },
  );

  return { ...state, enemies: Array.from(result.newEnemies) };
};

const generateSpecialAreas = (
  count: number,
  type: SpecialArea["type"],
  state: GameState,
  random: () => number,
): SpecialArea[] => {
  return Array.from({ length: count }, () => {
    const { x, y } = createSafePosition(state.canvas, state.player, random);
    return {
      x,
      y,
      radius: random() * 20 + 10,
      type,
    };
  });
};

const isColliding = (
  a: { x: number; y: number; radius: number },
  b: { x: number; y: number; radius: number },
): boolean => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < a.radius + b.radius;
};

const isDodging = (
  a: { x: number; y: number; radius: number },
  b: { x: number; y: number; radius: number },
): boolean => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance >= a.radius + b.radius && distance < 5;
};

const handleSurpriseAction = (
  state: GameState,
  eventId: number,
  random: () => number,
  unique: () => number,
): GameState => {
  switch (eventId) {
    case 1:
      return handleHolesAppear(state, random);
    case 2:
      return handleJasonSpeedUp(state);
    case 3:
      return handlePlayerSpeedUp(state);
    case 4:
      return handlePlayerSlowDown(state);
    case 5:
      return handleControlsReversed(state);
    case 6:
      return handleSlipperyFloor(state, random);
    case 7:
      return handleStickyFloor(state, random);
    case 8:
      return handleArenaShapeChange(state, random);
    case 9:
      return handleJasonsToEdges(state);
    case 10:
      return handleSuperJasonAppears(state, random, unique);
    case 11:
      return handleFourNewJasons(state, random, unique);
    case 12:
      return handleDoubleJasons(state, random, unique);
    case 13:
      return handleOnlyBiggestJason(state);
    default:
      return state;
  }
};

const handleHolesAppear = (
  state: GameState,
  random: () => number,
): GameState => {
  const holes = generateSpecialAreas(3, "hole", state, random);
  return {
    ...state,
    specialAreas: [...state.specialAreas, ...holes],
  };
};

const handleSlipperyFloor = (
  state: GameState,
  random: () => number,
): GameState => {
  const slipperyAreas = generateSpecialAreas(3, "slippery", state, random);
  return {
    ...state,
    specialAreas: [...state.specialAreas, ...slipperyAreas],
  };
};

const handleStickyFloor = (
  state: GameState,
  random: () => number,
): GameState => {
  const stickyAreas = generateSpecialAreas(3, "sticky", state, random);
  return {
    ...state,
    specialAreas: [...state.specialAreas, ...stickyAreas],
  };
};

const handleControlsReversed = (state: GameState): GameState => {
  return { ...state, controlsReversed: !state.controlsReversed };
};

const handleArenaShapeChange = (
  state: GameState,
  random: () => number,
): GameState => {
  console.log("TODO: Arena Shape Change", random());
  return state;
};

const handleSuperJasonAppears = (
  state: GameState,
  random: () => number,
  unique: () => number,
): GameState => {
  const { x, y } = createSafePosition(state.canvas, state.player, random);
  const superJason = {
    id: `Jason${unique()}`,
    x,
    y,
    radius: 15,
    speed: 90,
  };
  return {
    ...state,
    enemies: [...state.enemies, superJason],
    score: { ...state.score, current: state.score.current + 30 },
  };
};

const handleFourNewJasons = (
  state: GameState,
  random: () => number,
  unique: () => number,
): GameState => {
  const newJasons = Array.from({ length: 4 }, (_, i) => {
    const { x, y } = createSafePosition(state.canvas, state.player, random);
    return {
      id: `Jason${unique() + i}`,
      x,
      y,
      radius: 5,
      speed: 60,
    };
  });
  return {
    ...state,
    enemies: [...state.enemies, ...newJasons],
    score: { ...state.score, current: state.score.current + 40 },
  };
};

const handleDoubleJasons = (
  state: GameState,
  random: () => number,
  unique: () => number,
): GameState => {
  const newJasons = Array.from({ length: state.enemies.length }, (_, i) => {
    const { x, y } = createSafePosition(state.canvas, state.player, random);
    return {
      id: `Jason${unique() + i}`,
      x,
      y,
      radius: 5,
      speed: 60,
    };
  });
  return {
    ...state,
    enemies: [...state.enemies, ...newJasons],
    score: {
      ...state.score,
      current: state.score.current + 10 * newJasons.length,
    },
  };
};

const handleJasonSpeedUp = (state: GameState): GameState => {
  return {
    ...state,
    enemies: state.enemies.map((enemy) => ({
      ...enemy,
      speed: enemy.speed + 10,
    })),
  };
};

const handlePlayerSpeedUp = (state: GameState): GameState => {
  return {
    ...state,
    player: {
      ...state.player,
      speed: state.player.speed + 10,
    },
  };
};

const handlePlayerSlowDown = (state: GameState): GameState => {
  return {
    ...state,
    player: {
      ...state.player,
      speed: Math.max(40, state.player.speed - 10),
    },
  };
};

const handleOnlyBiggestJason = (state: GameState): GameState => {
  const biggestJason = state.enemies.reduce((prev, current) =>
    prev.radius >= current.radius ? prev : current,
  );
  return {
    ...state,
    enemies: [biggestJason],
  };
};

const handleJasonsToEdges = (state: GameState): GameState => {
  const { canvas, enemies } = state;
  return {
    ...state,
    enemies: enemies.map((enemy) => {
      return {
        ...enemy,
        x:
          enemy.x < canvas.width / 2
            ? enemy.radius
            : canvas.width - enemy.radius,
        y:
          enemy.y < canvas.height / 2
            ? enemy.radius
            : canvas.height - enemy.radius,
      };
    }),
  };
};
