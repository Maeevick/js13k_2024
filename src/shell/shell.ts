import {
  createInitialState,
  Enemy,
  MenuOptions,
  Player,
  SpecialArea,
  Surprise,
  updateGameState,
  type GameState,
} from "../core/core.ts";

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
    if (state.menu.displayed) {
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
    if ("Enter" === key && (state.menu.displayed || state.gameOver)) {
      if (state.gameOver) {
        resetGame();
      }
      if (state.menu.selected === "START") {
        state.menu.displayed = false;
      }
      if (state.menu.selected === "HIGH SCORES") {
        console.log("GO TO HIGH SCORES");
      }
      if (state.menu.selected === "CREDITS") {
        console.log("GO TO CREDITS");
      }
      requestAnimationFrame(gameLoop);
    }
  };

  // const handleTouchStart = (event: TouchEvent) => {
  //   event.preventDefault();
  //   state = handleTouchEvents(state)(event);

  //   resetGame();
  // };

  // const handleTouchMove = (event: TouchEvent) => {
  //   event.preventDefault();
  //   state = handleTouchEvents(state)(event);
  // };

  const gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    state = updateGameState(state, deltaTime, Math.random, Date.now);

    if (state.menu.displayed) {
      renderMenu({ ...state, ctx, restartButton: null });
    } else {
      renderGame({ ...state, ctx, restartButton: null });
    }

    if (!state.gameOver && !state.menu.displayed) {
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
    // canvas,
    handleMenuNavigation,
    handleMenuValidation,
    handleArrowKeyPress,
    resetGame,
    // handleTouchStart,
    // handleTouchMove
  );

  requestAnimationFrame(gameLoop);
};

const setupEventListeners = (
  // canvas: HTMLCanvasElement,
  handleMenuNavigation: (key: string) => void,
  handleMenuValidation: (key: string) => void,
  handleArrowKeyPress: (key: string, isPressed: boolean) => void,
  resetGame: () => void,
  // handleTouchStart: (event: TouchEvent) => void,
  // handleTouchMove: (event: TouchEvent) => void
) => {
  window.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      handleMenuNavigation(e.key);
    }
    if ("Enter" === e.key) {
      handleMenuValidation(e.key);
      resetGame();
    }
  });

  // if (isToucheDevice()) {
  //   setupTouchEventListeners(canvas, handleTouchStart, handleTouchMove);
  // } else {
  setupKeyboardEventListeners(handleArrowKeyPress);
  // }
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
// const setupTouchEventListeners = (
//   canvas: HTMLCanvasElement,
//   handleTouchStart: (event: TouchEvent) => void,
//   handleTouchMove: (event: TouchEvent) => void
// ) => {
//   canvas.addEventListener("touchstart", handleTouchStart);
//   canvas.addEventListener("touchmove", handleTouchMove);
// };

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

  console.log("SELECTED", Date.now(), state.menu.selected);

  menu.options.forEach((opt, i) => {
    const color = opt === menu.selected ? "yellow" : "green";

    ctx.fillStyle = color;
    ctx.fillText(opt, 160, 110 + i * 50);
  });

  ctx.fillStyle = "cyan";
  ctx.font = "bold 10px Courier New";
  ctx.textAlign = "left";
  ctx.fillText("1 free coin to flee", 10, 310);

  ctx.fillStyle = "#FF6100";
  ctx.textAlign = "right";
  ctx.fillText("A MicroGame by Maeevick", 310, 310);
};

const renderGame = (state: RenderState): void => {
  const {
    ctx,
    player,
    enemies,
    specialAreas,
    canvas,
    // joystick,
    gameOver,
    youWin,
    event,
  } = state;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer(ctx, player);

  enemies.forEach((enemy) => {
    drawEnemy(ctx, enemy);
  });

  specialAreas.forEach((area) => {
    drawSpecialArea(ctx, area);
  });

  drawEventNotification(ctx, event, canvas);

  // if (isToucheDevice()) {
  //   drawJoystick(ctx, joystick, state, canvas);
  // }

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

    drawEndGame(ctx, canvas, restartButton, youWin, event.currentScore);

    state.restartButton = restartButton;
  } else {
    state.restartButton = null;
  }
};

// const handleTouchEvents =
//   (state: GameState) =>
//   (event: TouchEvent): GameState => {
//     const { joystick } = state;

//     const { clientX, clientY } = event.touches[0];
//     const rect =
//       event.currentTarget instanceof Element
//         ? event.currentTarget.getBoundingClientRect()
//         : null;

//     if (rect) {
//       const touchX = clientX - rect.left;
//       const touchY = clientY - rect.top;

//       const dx = touchX - joystick.x;
//       const dy = touchY - joystick.y;
//       const distance = Math.sqrt(dx ** 2 + dy ** 2);

//       if (distance <= joystick.radius) {
//         const angle = Math.atan2(dy, dx) * (180 / Math.PI);
//         const directions: { [key: string]: boolean } = {
//           right: angle > -67.5 && angle <= 67.5,
//           down: angle > 22.5 && angle <= 157.5,
//           left: angle > 112.5 || angle <= -112.5,
//           up: angle > -157.5 && angle <= -22.5,
//         };

//         return {
//           ...state,
//           directions,
//         };
//       }
//     }

//     return state;
//   };

// const isToucheDevice = (): boolean => {
//   return (
//     !!window.ontouchstart ||
//     (navigator.maxTouchPoints > 0 && navigator.maxTouchPoints <= 5)
//   );
// };

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

// const drawJoystick = (
//   ctx: CanvasRenderingContext2D,
//   joystick: { x: number; y: number; radius: number },
//   state: RenderState,
//   canvas: { width: number; height: number }
// ): void => {
//   ctx.beginPath();
//   ctx.moveTo(joystick.x, joystick.y);
//   ctx.lineTo(
//     joystick.x +
//       joystick.radius *
//         (state.directions.right ? 1 : state.directions.left ? -1 : 0),
//     joystick.y +
//       joystick.radius *
//         (state.directions.down ? 1 : state.directions.up ? -1 : 0)
//   );
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 2;
//   ctx.stroke();

//   const joystickSize = 100;
//   const innerJoystickSize = 10;
//   const joystickX = canvas.width - 20 - joystickSize / 2;
//   const joystickY = canvas.height - 20 - joystickSize / 2;

//   ctx.beginPath();
//   ctx.arc(joystickX, joystickY, joystickSize / 2, 0, 2 * Math.PI);
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 2;
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.arc(joystickX, joystickY, innerJoystickSize / 2, 0, 2 * Math.PI);
//   ctx.fillStyle = "black";
//   ctx.fill();

//   ctx.beginPath();
//   ctx.moveTo(joystickX, joystickY - joystickSize / 2 + innerJoystickSize / 2);
//   ctx.lineTo(joystickX, joystickY - joystickSize / 2 + innerJoystickSize + 10);
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.moveTo(joystickX + joystickSize / 2 - innerJoystickSize / 2, joystickY);
//   ctx.lineTo(joystickX + joystickSize / 2 - innerJoystickSize - 10, joystickY);
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.moveTo(joystickX, joystickY + joystickSize / 2 - innerJoystickSize / 2);
//   ctx.lineTo(joystickX, joystickY + joystickSize / 2 - innerJoystickSize - 10);
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.moveTo(joystickX - joystickSize / 2 + innerJoystickSize / 2, joystickY);
//   ctx.lineTo(joystickX - joystickSize / 2 + innerJoystickSize + 10, joystickY);
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.moveTo(
//     joystickX - joystickSize / 2 + innerJoystickSize / 2,
//     joystickY - joystickSize / 2 + innerJoystickSize / 2
//   );
//   ctx.lineTo(
//     joystickX - joystickSize / 2 + innerJoystickSize + 10,
//     joystickY - joystickSize / 2 + innerJoystickSize + 10
//   );
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.moveTo(
//     joystickX + joystickSize / 2 - innerJoystickSize / 2,
//     joystickY - joystickSize / 2 + innerJoystickSize / 2
//   );
//   ctx.lineTo(
//     joystickX + joystickSize / 2 - innerJoystickSize - 10,
//     joystickY - joystickSize / 2 + innerJoystickSize + 10
//   );
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.moveTo(
//     joystickX - joystickSize / 2 + innerJoystickSize / 2,
//     joystickY + joystickSize / 2 - innerJoystickSize / 2
//   );
//   ctx.lineTo(
//     joystickX - joystickSize / 2 + innerJoystickSize + 10,
//     joystickY + joystickSize / 2 - innerJoystickSize - 10
//   );
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.moveTo(
//     joystickX + joystickSize / 2 - innerJoystickSize / 2,
//     joystickY + joystickSize / 2 - innerJoystickSize / 2
//   );
//   ctx.lineTo(
//     joystickX + joystickSize / 2 - innerJoystickSize - 10,
//     joystickY + joystickSize / 2 - innerJoystickSize - 10
//   );
//   ctx.stroke();
// };

const drawEventNotification = (
  ctx: CanvasRenderingContext2D,
  event: {
    ROUND_DURATION: number;
    round: number;
    timer: number;
    surprises: Surprise[];
    currentSurprise: Surprise | null;
    currentScore: number;
  },
  canvas: { width: number; height: number },
): void => {
  ctx.fillStyle = "black";
  ctx.font = "bold 12px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(
    `SCORE: ${event.currentScore} - ROUND: ${
      event.round + 1
    } - TIMER: ${Math.floor(event.timer / 1000)}s`,
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
