export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private timestep: number = 1000 / 60;

  private circleX: number = 160;
  private circleY: number = 160;
  private circleRadius: number = 5;
  private moveSpeed: number = 120;

  private ennemyCount: number = 5;
  private enemies: { x: number; y: number }[] = [];

  private gameOver: boolean = false;

  private keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;

    this.setupEventListeners();
    this.createEnemies();
  }

  private setupEventListeners(): void {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  private createEnemies(): void {
    for (let i = 0; i < this.ennemyCount; i++) {
      this.enemies.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
      });
    }
  }

  private checkCollisions(): void {
    for (const enemy of this.enemies) {
      const dx = this.circleX - enemy.x;
      const dy = this.circleY - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.circleRadius + 5) {
        this.gameEnd();
        return;
      }
    }
  }

  private gameEnd(): void {
    this.gameOver = true;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key in this.keys) {
      e.preventDefault();
      this.keys[e.key] = true;
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.key in this.keys) {
      e.preventDefault();
      this.keys[e.key] = false;
    }
  }

  private update(deltaTime: number): void {
    if (this.gameOver) return;

    const moveDistance = this.moveSpeed * (deltaTime / 1000);

    if (this.keys.ArrowUp) this.circleY -= moveDistance;
    if (this.keys.ArrowDown) this.circleY += moveDistance;
    if (this.keys.ArrowLeft) this.circleX -= moveDistance;
    if (this.keys.ArrowRight) this.circleX += moveDistance;

    this.circleX = Math.max(
      this.circleRadius,
      Math.min(this.canvas.width - this.circleRadius, this.circleX),
    );
    this.circleY = Math.max(
      this.circleRadius,
      Math.min(this.canvas.height - this.circleRadius, this.circleY),
    );

    this.checkCollisions();
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();
    this.ctx.arc(this.circleX, this.circleY, this.circleRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = "green";
    this.ctx.fill();

    this.enemies.forEach((enemy) => {
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(enemy.x - 5, enemy.y - 5, 10, 10);

      this.ctx.fillStyle = "red";
      this.ctx.font = "8px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText("XIII", enemy.x, enemy.y);
    });

    if (this.gameOver) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = "white";
      this.ctx.font = "48px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(
        "GAME OVER",
        this.canvas.width / 2,
        this.canvas.height / 2,
      );
    }
  }

  private loop(currentTime: number): void {
    requestAnimationFrame(this.loop.bind(this));

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.accumulator += deltaTime;

    while (this.accumulator >= this.timestep) {
      this.update(this.timestep);
      this.accumulator -= this.timestep;
    }

    this.render();
  }

  public start(): void {
    this.gameOver = false;

    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }
}
