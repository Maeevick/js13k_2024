export type GameState = {
  player: { x: number; y: number; radius: number; speed: number };
  enemies: Array<{ x: number; y: number; speed: number }>;
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
): GameState => ({
  player: { x: canvasWidth / 2, y: canvasHeight / 2, radius: 5, speed: 120 },
  enemies: Array.from({ length: 5 }, () => ({
    x: random() * canvasWidth,
    y: random() * canvasHeight,
    speed: 100,
  })),
  canvas: { width: canvasWidth, height: canvasHeight },
  directions: {
    left: false,
    right: false,
    up: false,
    down: false,
  },
  joystick: createTouchZone(canvasWidth, canvasHeight),
  gameOver: false,
});

export const updateGameState = (
  state: GameState,
  deltaTime: number,
): GameState => {
  if (state.gameOver) return state;
  return checkCollisions(
    updatePlayerPosition(updateEnemyPositions(state, deltaTime), deltaTime),
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
      x: Math.max(0, Math.min(canvas.width, newX)),
      y: Math.max(0, Math.min(canvas.height, newY)),
      speed: enemy.speed,
    };
  });

  return {
    ...state,
    enemies: newEnemies,
  };
};

const checkCollisions = (state: GameState): GameState => {
  const { player, enemies } = state;

  const collision = enemies.some((enemy) => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < player.radius + 5;
  });

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
