export type GameState = {
  player: { id: string; x: number; y: number; radius: number; speed: number };
  enemies: Array<{
    id: string;
    x: number;
    y: number;
    radius: number;
    speed: number;
  }>;
  canvas: { width: number; height: number };
  joystick: {
    x: number;
    y: number;
    radius: number;
  };
  directions: { [key: string]: boolean };
  gameOver: boolean;
};

export const createInitialState = (
  canvasWidth: number,
  canvasHeight: number,
  random: () => number,
): GameState => {
  const player = {
    id: "Player0",
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    radius: 5,
    speed: 120,
  };

  const createEnemyPosition = () => {
    let x = random() * canvasWidth;
    let y = random() * canvasHeight;

    const dx = x - player.x;
    const dy = y - player.y;

    if (Math.abs(dx) < 100) {
      x = Math.max(
        0,
        Math.min(canvasWidth, player.x + Math.abs(dx) * (100 / dx)),
      );
    }

    if (Math.abs(dy) < 100) {
      y = Math.max(
        0,
        Math.min(canvasHeight, player.y + Math.abs(dy) * (100 / dy)),
      );
    }

    return { x, y };
  };

  return {
    player,
    enemies: Array.from({ length: 5 }, (_, i) => {
      const { x, y } = createEnemyPosition();

      return {
        id: `Jason${i}`,
        x,
        y,
        radius: 5,
        speed: 60,
      };
    }),
    canvas: { width: canvasWidth, height: canvasHeight },
    directions: {
      left: false,
      right: false,
      up: false,
      down: false,
    },
    joystick: createTouchZone(canvasWidth, canvasHeight),
    gameOver: false,
  };
};

export const updateGameState = (
  state: GameState,
  deltaTime: number,
): GameState => {
  if (state.gameOver) return state;
  return checkCollisions(
    updatePlayerPosition(
      checkEnemyCollisions(updateEnemyPositions(state, deltaTime)),
      deltaTime,
    ),
  );
};

const updatePlayerPosition = (
  state: GameState,
  deltaTime: number,
): GameState => {
  const { player, directions, canvas } = state;

  const moveDistance = player.speed * (deltaTime / 1000);

  const newX = directions.left
    ? Math.max(player.radius, player.x - moveDistance)
    : directions.right
      ? Math.min(canvas.width - player.radius, player.x + moveDistance)
      : player.x;

  const newY = directions.up
    ? Math.max(player.radius, player.y - moveDistance)
    : directions.down
      ? Math.min(canvas.height - player.radius, player.y + moveDistance)
      : player.y;

  return {
    ...state,
    player: { ...player, x: newX, y: newY },
  };
};

const updateEnemyPositions = (
  state: GameState,
  deltaTime: number,
): GameState => {
  const { player, enemies, canvas } = state;

  const newEnemies = enemies.map((enemy) => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveDistance = (enemy.speed * (deltaTime / 1000)) / distance;

    const newX = enemy.x + dx * moveDistance;
    const newY = enemy.y + dy * moveDistance;

    return {
      id: enemy.id,
      x: Math.max(0, Math.min(canvas.width, newX)),
      y: Math.max(0, Math.min(canvas.height, newY)),
      radius: enemy.radius,
      speed: enemy.speed,
    };
  });

  return {
    ...state,
    enemies: newEnemies,
  };
};

const checkEnemyCollisions = (state: GameState): GameState => {
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
        id: `jason${Date.now()}`, // Generate a new unique id
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

const isColliding = (
  a: { x: number; y: number; radius: number },
  b: { x: number; y: number; radius: number },
): boolean => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < a.radius + b.radius;
};

const checkCollisions = (state: GameState): GameState => {
  const { player, enemies } = state;

  const collision = enemies.some((enemy) => isColliding(player, enemy));

  return collision ? { ...state, gameOver: true } : state;
};

const createTouchZone = (
  canvasWidth: number,
  canvasHeight: number,
): GameState["joystick"] => {
  const zoneSize = 100;
  return {
    x: canvasWidth - zoneSize / 2 - 20,
    y: canvasHeight - zoneSize / 2 - 20,
    radius: zoneSize / 2,
  };
};
