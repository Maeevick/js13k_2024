import type {
  Enemy,
  MenuOptions,
  Player,
  SpecialArea,
  Surprise,
  GameState,
} from "../core/core.ts";

import { CREDITS, createInitialState, updateGameState } from "../core/core.ts";

type RenderState = GameState & {
  ctx: CanvasRenderingContext2D;
  restartButton: { x: number; y: number; width: number; height: number } | null;
};

export const run = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const [canvas, ctx] = setupCanvas("canvas");

    startGame(canvas, ctx);
  });
};

const setupCanvas = (
  canvasId: string,
): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  return [canvas, ctx];
};

const startGame = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) => {
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

  const handleMenuNavigation = (key: string) => {
    if (state.menu.main) {
      const fromSelectedToNext: Record<
        string,
        Record<MenuOptions, MenuOptions>
      > = {
        ArrowDown: {
          START: "HIGH SCORES",
          "HIGH SCORES": "CREDITS",
          CREDITS: "START",
        },
        ArrowUp: {
          START: "CREDITS",
          "HIGH SCORES": "START",
          CREDITS: "HIGH SCORES",
        },
      };

      state = {
        ...state,
        menu: {
          ...state.menu,
          selected: fromSelectedToNext[key][state.menu.selected],
        },
      };
      renderMenu({ ...state, ctx, restartButton: null });
    }
  };

  const handleMenuValidation = (key: string) => {
    if ("Enter" === key) {
      if (state.menu.main && state.menu.selected === "START") {
        state.menu.main = false;
        state.menu.scores = false;
        state.menu.credits = false;
        state.gameOver = false;
      } else if (state.menu.main && state.menu.selected === "HIGH SCORES") {
        state.menu.main = false;
        state.menu.scores = true;
        state.menu.credits = false;
      } else if (state.menu.main && state.menu.selected === "CREDITS") {
        state.menu.main = false;
        state.menu.scores = false;
        state.menu.credits = true;
      } else if (state.menu.scores || state.menu.credits || state.youWin) {
        state.menu.scores = false;
        state.menu.credits = false;
        state.menu.main = true;
      } else {
        resetGame();
      }
      requestAnimationFrame(gameLoop);
    }
  };

  const gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    state = updateGameState(state, deltaTime, Math.random, Date.now);

    if (state.menu.main) {
      renderMenu({ ...state, ctx, restartButton: null });
    } else if (state.menu.scores) {
      renderHighScores({ ...state, ctx, restartButton: null });
    } else if (state.menu.credits) {
      renderCredits({ ...state, ctx, restartButton: null });
    } else {
      renderGame({ ...state, ctx, restartButton: null });
    }

    if (!state.gameOver) {
      requestAnimationFrame(gameLoop);
    }
  };

  const resetGame = () => {
    if (state.gameOver) {
      state = createInitialState(
        canvas.width,
        canvas.height,
        Math.random,
        false,
      );
    }
  };

  setupEventListeners(
    handleMenuNavigation,
    handleMenuValidation,
    handleArrowKeyPress,
  );

  requestAnimationFrame(gameLoop);
};

const setupEventListeners = (
  handleMenuNavigation: (key: string) => void,
  handleMenuValidation: (key: string) => void,
  handleArrowKeyPress: (key: string, isPressed: boolean) => void,
) => {
  window.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      handleMenuNavigation(e.key);
    }
    if ("Enter" === e.key) {
      handleMenuValidation(e.key);
    }
  });

  setupKeyboardEventListeners(handleArrowKeyPress);
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

const renderMenu = (state: RenderState): void => {
  const { canvas, ctx, menu } = state;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#FF6100";
  ctx.font = "bold 30px Courier New";
  ctx.fillText("TRISKAIDEK ARENA", canvas.width / 2, 30);
  ctx.strokeStyle = "#FF6100";
  ctx.strokeRect(20, 40, 280, 1);

  ctx.font = "bold 20px Courier New";

  menu.options.forEach((opt, i) => {
    const color = opt === menu.selected ? "yellow" : "green";

    ctx.fillStyle = color;
    ctx.fillText(opt, canvas.width / 2, 110 + i * 50);
  });

  ctx.fillStyle = "cyan";
  ctx.font = "bold 10px Courier New";
  ctx.textAlign = "left";
  ctx.fillText("1 free coin to flee", 10, 310);

  ctx.fillStyle = "#FF6100";
  ctx.textAlign = "right";
  ctx.fillText("A MicroGame by Maeevick", 310, 310);
};

const renderHighScores = (state: RenderState): void => {
  const { canvas, ctx } = state;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FF6100";
  ctx.font = "bold 30px Courier New";
  ctx.fillText("HIGH SCORES", canvas.width / 2, 30);
  ctx.strokeStyle = "#FF6100";
  ctx.strokeRect(20, 40, 280, 1);

  ctx.font = "bold 20px Courier New";

  [
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
  ].forEach((cred, i) => {
    ctx.fillStyle = i % 2 ? "yellow" : "green";
    ctx.fillText(cred, canvas.width / 2, 60 + i * 20);
  });

  drawBackButton(canvas, ctx);
};
const renderCredits = (state: RenderState): void => {
  const { canvas, ctx } = state;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FF6100";
  ctx.font = "bold 30px Courier New";
  ctx.fillText("CREDITS", canvas.width / 2, 30);
  ctx.strokeStyle = "#FF6100";
  ctx.strokeRect(20, 40, 280, 1);

  ctx.font = "bold 20px Courier New";

  CREDITS.forEach((cred, i) => {
    ctx.fillStyle = i % 2 ? "yellow" : "green";
    ctx.fillText(cred, canvas.width / 2, 60 + i * 20);
  });

  drawBackButton(canvas, ctx);
};

const drawBackButton = (
  canvas: { width: number; height: number },
  ctx: CanvasRenderingContext2D,
): void => {
  const width = 100;
  const height = 40;
  const x = canvas.width / 2 - 50;
  const y = canvas.height - 50;

  ctx.fillStyle = "white";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = "black";
  ctx.font = "bold 20px Courier New";
  ctx.fillText("BACK", canvas.width / 2, y + height / 2);
};

const renderGame = (state: RenderState): void => {
  const {
    ctx,
    player,
    enemies,
    specialAreas,
    canvas,
    gameOver,
    youWin,
    event,
    score,
  } = state;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer(ctx, player);

  enemies.forEach((enemy) => {
    drawEnemy(ctx, enemy);
  });

  specialAreas.forEach((area) => {
    drawSpecialArea(ctx, area);
  });

  drawEventNotification(ctx, event, state.score.current, canvas);

  if (gameOver || youWin) {
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

    drawEndGame(ctx, canvas, restartButton, youWin, score.current);

    state.restartButton = restartButton;
  } else {
    state.restartButton = null;
  }
};

const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player): void => {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
};

const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy): void => {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.strokeRect(
    enemy.x - enemy.radius,
    enemy.y - enemy.radius,
    enemy.radius * 2,
    enemy.radius * 2,
  );
  ctx.fillStyle = "red";
  ctx.font = "bold 6px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("13", enemy.x, enemy.y);
};

const drawSpecialArea = (
  ctx: CanvasRenderingContext2D,
  area: SpecialArea,
): void => {
  ctx.beginPath();
  ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2);
  switch (area.type) {
    case "hole":
      ctx.fillStyle = "black";
      break;
    case "slippery":
      ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
      break;
    case "sticky":
      ctx.fillStyle = "rgba(139, 69, 19, 0.3)";
      break;
  }
  ctx.fill();
};

const drawEndGame = (
  ctx: CanvasRenderingContext2D,
  canvas: { width: number; height: number },
  button: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  isVictory: boolean,
  score: number,
): void => {
  const { x, y, width, height } = button;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "bold 20px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (isVictory) {
    ctx.fillText("CONGRATULATIONS", canvas.width / 2, canvas.height / 2);
    ctx.fillText(
      `YOU SCORE IS: ${score}`,
      canvas.width / 2,
      canvas.height / 2 + 30,
    );
  } else {
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  ctx.fillStyle = "white";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = "black";
  ctx.font = "bold 20px Courier New";
  ctx.fillText("RESTART", canvas.width / 2, y + height / 2);
};

const drawEventNotification = (
  ctx: CanvasRenderingContext2D,
  event: {
    ROUND_DURATION: number;
    round: number;
    timer: number;
    surprises: Surprise[];
    currentSurprise: Surprise | null;
  },
  currentScore: number,
  canvas: { width: number; height: number },
): void => {
  ctx.fillStyle = "black";
  ctx.font = "bold 12px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(
    `SCORE: ${currentScore} - ROUND: ${event.round + 1} - TIMER: ${Math.floor(
      event.timer / 1000,
    )}s`,
    canvas.width / 2,
    10,
  );

  if (event.round && event.currentSurprise) {
    ctx.fillStyle = "#ff6100";
    ctx.font = "bold 12px Courier New";
    ctx.fillText(
      event.currentSurprise.name.toUpperCase(),
      canvas.width / 2,
      40,
    );
  }
};
