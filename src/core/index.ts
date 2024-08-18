export type GameState = {
  player: { x: number; y: number; radius: number };
  enemies: Array<{ x: number; y: number }>;
  canvas: { width: number; height: number };
  keys: { [key: string]: boolean };
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
  keys: {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  },
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

  const newX = state.keys.ArrowLeft
    ? Math.max(state.player.radius, state.player.x - moveDistance)
    : state.keys.ArrowRight
      ? Math.min(
          state.canvas.width - state.player.radius,
          state.player.x + moveDistance,
        )
      : state.player.x;

  const newY = state.keys.ArrowUp
    ? Math.max(state.player.radius, state.player.y - moveDistance)
    : state.keys.ArrowDown
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
