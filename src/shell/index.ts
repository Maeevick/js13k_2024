import {
  createInitialState,
  updateGameState,
  type GameState,
} from "../core/index.ts";

type RenderState = GameState & {
  ctx: CanvasRenderingContext2D;
  restartButton: { x: number; y: number; width: number; height: number } | null;
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

  const handleArrowKeyPress = (key: string, isPressed: boolean) => {
    const direction: Record<string, string> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowRight: "right",
      ArrowLeft: "left",
    };

    state = {
      ...state,
      directions: { ...state.directions, [direction[key]]: isPressed },
    };
  };

  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    state = handleTouchEvents(state)(event);

    resetGame();
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    state = handleTouchEvents(state)(event);
  };

  const gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    state = updateGameState(state, deltaTime);

    render({ ...state, ctx, restartButton: null });

    if (!state.gameOver) {
      requestAnimationFrame(gameLoop);
    }
  };

  const resetGame = () => {
    if (state.gameOver) {
      state = createInitialState(canvas.width, canvas.height, Math.random);
      requestAnimationFrame(gameLoop);
    }
  };

  setupEventListeners(
    canvas,
    handleArrowKeyPress,
    resetGame,
    handleTouchStart,
    handleTouchMove,
  );

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
  handleArrowKeyPress: (key: string, isPressed: boolean) => void,
  resetGame: () => void,
  handleTouchStart: (event: TouchEvent) => void,
  handleTouchMove: (event: TouchEvent) => void,
) => {
  if (isToucheDevice()) {
    setupTouchEventListeners(canvas, handleTouchStart, handleTouchMove);
  } else {
    setupKeyboardEventListeners(handleArrowKeyPress);
  }

  canvas.addEventListener("click", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.debug("x:y", { x, y });

    resetGame();
  });
};

const setupKeyboardEventListeners = (
  handleArrowKeyPress: (key: string, isPressed: boolean) => void,
) => {
  window.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      handleArrowKeyPress(e.key, true);
    }
  });

  window.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      handleArrowKeyPress(e.key, false);
    }
  });
};
const setupTouchEventListeners = (
  canvas: HTMLCanvasElement,
  handleTouchStart: (event: TouchEvent) => void,
  handleTouchMove: (event: TouchEvent) => void,
) => {
  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchmove", handleTouchMove);
};

const render = (state: RenderState): void => {
  const { ctx, player, enemies, canvas, joystick, gameOver } = state;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer(ctx, player);

  enemies.forEach((enemy) => {
    drawEnemy(ctx, enemy);
  });

  if (isToucheDevice()) {
    drawJoystick(ctx, joystick, state, canvas);
  }

  if (gameOver) {
    const buttonWidth = 100;
    const buttonHeight = 40;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2 + 50;

    const restartButton = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
    };

    drawRestartButton(ctx, canvas, restartButton);

    state.restartButton = restartButton;
  } else {
    state.restartButton = null;
  }
};

const handleTouchEvents =
  (state: GameState) =>
  (event: TouchEvent): GameState => {
    const { joystick } = state;

    const { clientX, clientY } = event.touches[0];
    const rect =
      event.currentTarget instanceof Element
        ? event.currentTarget.getBoundingClientRect()
        : null;

    if (rect) {
      const touchX = clientX - rect.left;
      const touchY = clientY - rect.top;

      const dx = touchX - joystick.x;
      const dy = touchY - joystick.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance <= joystick.radius) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const directions: { [key: string]: boolean } = {
          right: angle > -67.5 && angle <= 67.5,
          down: angle > 22.5 && angle <= 157.5,
          left: angle > 112.5 || angle <= -112.5,
          up: angle > -157.5 && angle <= -22.5,
        };

        return {
          ...state,
          directions,
        };
      }
    }

    return state;
  };

const isToucheDevice = () => {
  return (
    window.ontouchstart ||
    (navigator.maxTouchPoints > 0 && navigator.maxTouchPoints <= 5)
  );
};

const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  player: { x: number; y: number; radius: number },
) => {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
};

const drawEnemy = (
  ctx: CanvasRenderingContext2D,
  enemy: { x: number; y: number; radius: number },
) => {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.strokeRect(
    enemy.x - enemy.radius,
    enemy.y - enemy.radius,
    enemy.radius * 2,
    enemy.radius * 2,
  );
  ctx.fillStyle = "red";
  ctx.font = "8px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("XIII", enemy.x, enemy.y);
};

const drawRestartButton = (
  ctx: CanvasRenderingContext2D,
  canvas: { width: number; height: number },
  button: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
) => {
  const { x, y, width, height } = button;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

  ctx.fillStyle = "white";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("RESTART", canvas.width / 2, y + height / 2);
};

const drawJoystick = (
  ctx: CanvasRenderingContext2D,
  joystick: { x: number; y: number; radius: number },
  state: RenderState,
  canvas: { width: number; height: number },
) => {
  ctx.beginPath();
  ctx.moveTo(joystick.x, joystick.y);
  ctx.lineTo(
    joystick.x +
      joystick.radius *
        (state.directions.right ? 1 : state.directions.left ? -1 : 0),
    joystick.y +
      joystick.radius *
        (state.directions.down ? 1 : state.directions.up ? -1 : 0),
  );
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  const joystickSize = 100;
  const innerJoystickSize = 10;
  const joystickX = canvas.width - 20 - joystickSize / 2;
  const joystickY = canvas.height - 20 - joystickSize / 2;

  ctx.beginPath();
  ctx.arc(joystickX, joystickY, joystickSize / 2, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(joystickX, joystickY, innerJoystickSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(joystickX, joystickY - joystickSize / 2 + innerJoystickSize / 2);
  ctx.lineTo(joystickX, joystickY - joystickSize / 2 + innerJoystickSize + 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(joystickX + joystickSize / 2 - innerJoystickSize / 2, joystickY);
  ctx.lineTo(joystickX + joystickSize / 2 - innerJoystickSize - 10, joystickY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(joystickX, joystickY + joystickSize / 2 - innerJoystickSize / 2);
  ctx.lineTo(joystickX, joystickY + joystickSize / 2 - innerJoystickSize - 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(joystickX - joystickSize / 2 + innerJoystickSize / 2, joystickY);
  ctx.lineTo(joystickX - joystickSize / 2 + innerJoystickSize + 10, joystickY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(
    joystickX - joystickSize / 2 + innerJoystickSize / 2,
    joystickY - joystickSize / 2 + innerJoystickSize / 2,
  );
  ctx.lineTo(
    joystickX - joystickSize / 2 + innerJoystickSize + 10,
    joystickY - joystickSize / 2 + innerJoystickSize + 10,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(
    joystickX + joystickSize / 2 - innerJoystickSize / 2,
    joystickY - joystickSize / 2 + innerJoystickSize / 2,
  );
  ctx.lineTo(
    joystickX + joystickSize / 2 - innerJoystickSize - 10,
    joystickY - joystickSize / 2 + innerJoystickSize + 10,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(
    joystickX - joystickSize / 2 + innerJoystickSize / 2,
    joystickY + joystickSize / 2 - innerJoystickSize / 2,
  );
  ctx.lineTo(
    joystickX - joystickSize / 2 + innerJoystickSize + 10,
    joystickY + joystickSize / 2 - innerJoystickSize - 10,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(
    joystickX + joystickSize / 2 - innerJoystickSize / 2,
    joystickY + joystickSize / 2 - innerJoystickSize / 2,
  );
  ctx.lineTo(
    joystickX + joystickSize / 2 - innerJoystickSize - 10,
    joystickY + joystickSize / 2 - innerJoystickSize - 10,
  );
  ctx.stroke();
};
