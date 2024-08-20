export type GameState = {
  player: { x: number; y: number; radius: number };
  enemies: Array<{ x: number; y: number }>;
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
  player: { x: canvasWidth / 2, y: canvasHeight / 2, radius: 5 },
  enemies: Array.from({ length: 5 }, () => ({
    x: random() * canvasWidth,
    y: random() * canvasHeight,
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
  return checkCollisions(updatePlayerPosition(state, deltaTime));
};

const updatePlayerPosition = (
  state: GameState,
  deltaTime: number,
): GameState => {
  const moveSpeed = 120;
  const moveDistance = moveSpeed * (deltaTime / 1000);

  const newX = state.directions.left
    ? Math.max(state.player.radius, state.player.x - moveDistance)
    : state.directions.right
      ? Math.min(
          state.canvas.width - state.player.radius,
          state.player.x + moveDistance,
        )
      : state.player.x;

  const newY = state.directions.up
    ? Math.max(state.player.radius, state.player.y - moveDistance)
    : state.directions.down
      ? Math.min(
          state.canvas.height - state.player.radius,
          state.player.y + moveDistance,
        )
      : state.player.y;

  return {
    ...state,
    player: { ...state.player, x: newX, y: newY },
  };
};

const checkCollisions = (state: GameState): GameState => {
  const collision = state.enemies.some((enemy) => {
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < state.player.radius + 5;
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
