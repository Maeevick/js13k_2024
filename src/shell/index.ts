import {
  createInitialState,
  updateGameState,
  type GameState,
} from "../core/index.ts";

type RenderState = GameState & {
  ctx: CanvasRenderingContext2D;
  homeButton: { x: number; y: number; width: number; height: number } | null;
};

export const run = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start") as HTMLButtonElement;
    const game = document.getElementById("canvas") as HTMLCanvasElement;

    startButton.addEventListener("click", () => {
      document.querySelectorAll(".home").forEach((element) => {
        element.classList.add("hidden");
      });

      game.classList.remove("hidden");

      startGame();
    });
  });
};

const startGame = () => {
  const [canvas, ctx] = setupCanvas("canvas");
  let state = createInitialState(canvas.width, canvas.height, Math.random);

  let lastTime = performance.now();

  const updateKeys = (key: string, isPressed: boolean) => {
    state = { ...state, keys: { ...state.keys, [key]: isPressed } };
  };

  const resetGame = () => {
    if (state.gameOver) {
      state = createInitialState(canvas.width, canvas.height, Math.random);
    }
  };

  setupEventListeners(canvas, updateKeys, resetGame);

  const gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    state = updateGameState(state, deltaTime);
    render({ ...state, ctx, homeButton: null });

    requestAnimationFrame(gameLoop);
  };

  requestAnimationFrame(gameLoop);
};

const setupCanvas = (
  canvasId: string,
): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  return [canvas, ctx];
};

const setupEventListeners = (
  canvas: HTMLCanvasElement,
  updateKeys: (key: string, isPressed: boolean) => void,
  resetGame: () => void,
) => {
  window.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      updateKeys(e.key, true);
    }
  });

  window.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      updateKeys(e.key, false);
    }
  });

  // TODO: handle click on canvas
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.debug("x:y", { x, y });

    resetGame();
  });
};

const render = (state: RenderState): void => {
  const { ctx, player, enemies, canvas, gameOver } = state;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();

  enemies.forEach((enemy) => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(enemy.x - 5, enemy.y - 5, 10, 10);
    ctx.fillStyle = "red";
    ctx.font = "8px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("XIII", enemy.x, enemy.y);
  });

  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    const buttonWidth = 100;
    const buttonHeight = 40;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2 + 50;

    ctx.fillStyle = "white";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("RESTART", canvas.width / 2, buttonY + buttonHeight / 2);

    state.homeButton = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
    };
  } else {
    state.homeButton = null;
  }
};
