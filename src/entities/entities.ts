import { Ship } from "./ship";

// Maintain an array filled with asteroid objects
export const asteroids: Asteroid[] = [];
export const activeLasers: Laser[] = [];
export const gameEntities: Entity[] = [...asteroids, ...activeLasers];

// helper API for a random range
const randomRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

// can extend Laser and Asteroid
// * ABSTRACT CLASS: this is a boilerplate
// * template that extensions can build off of

export abstract class Entity {
  width: number;
  height: number;
  vx: number;
  vy: number;
  worldX: number;
  worldY: number;

  // init
  constructor(
    width: number,
    height: number,
    vx: number,
    vy: number,
    worldX: number,
    worldY: number,
  ) {
    this.width = width;
    this.height = height;
    this.vx = vx;
    this.vy = vy;
    this.worldX = worldX;
    this.worldY = worldY;
  }
  tick(deltaTime: number) {
    this.worldX += this.vx * deltaTime;
    this.worldY += this.vy * deltaTime;
  }
  // Fallback padding. Subclasses can override this if needed.
  getPadding(): number {
    return Math.max(this.width, this.height);
  }

  // Subclasses MUST implement this to define their unique visual style
  drawShape(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    // Left empty or throws an error as a boilerplate template
  }
  render(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    shipX: number,
    shipY: number,
  ) {
    const padding: number = this.getPadding();

    const screenX: number = this.worldX - shipX + canvas.width / 2;
    const screenY: number = this.worldY - shipY + canvas.height / 2;
    // relative scrolling system
    if (
      screenX < -padding ||
      screenX > canvas.width + padding ||
      screenY < -padding ||
      screenY > canvas.height + padding
    ) {
      // hides the entity and skips rendering
      return;
    } else {
      this.drawShape(ctx, shipX, shipY);
    }
  }
}

// extra properties: radius,hp,maxHP, specifically for Asteroid
export class Asteroid extends Entity {
  radius: number;
  health: number;
  maxHealth: number;
  constructor(data: {
    worldX: number;
    worldY: number;
    vx: number;
    vy: number;
    radius: number;
    health: number;
    maxHealth: number;
  }) {
    // Pass the values up to the parent Entity constructor (filling width and height with 0 for now)
    super(0, 0, data.vx, data.vy, data.worldX, data.worldY);

    // 2. Set the unique asteroid properties
    this.radius = data.radius;
    this.health = data.health;
    this.maxHealth = data.maxHealth;
    // main drawing function with relative scrolling equipped into it!
  }
  getPadding(): number {
    return this.radius;
  }
  drawShape(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
  ): void {
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fill();
    ctx.stroke();
  }
  drawHealthBar(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    shipX: number,
    shipY: number,
  ): void {
    // 1. Calculate relative screen positions (matching your game's camera)
    const screenX = this.worldX - shipX + canvas.width / 2;
    const screenY = this.worldY - shipY + canvas.height / 2;

    // 2. Health Bar Dimensions
    const barWidth = this.radius * 1.5; // Scale width based on asteroid size
    const barHeight = 6;
    const barX = screenX - barWidth / 2;
    const barY = screenY - this.radius - 12; // Position 12px above the asteroid

    // 3. Draw Background (The empty dark track)
    ctx.fillStyle = "rgba(40, 40, 40, 0.7)";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // 4. Calculate health percentage and smooth dynamic color
    const hpPercent = Math.max(0, Math.min(1, this.health / this.maxHealth));

    // Smoothly maps 100% HP to 120 (Green) and 0% HP to 0 (Red)
    const hue = hpPercent * 120;
    ctx.fillStyle = `hsl(${hue}, 85%, 45%)`;

    // 5. Draw Foreground (The actual current health)
    ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

    // 6. Optional: Thin border around the bar for crisp contrast
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }
}

export function createAsteroid(input: Partial<Asteroid> = {}): Asteroid {
  const defaults = randomizeAsteroid();
  // if no input, create a default based on randomizeAsteroids()
  const asteroidData = {
    worldX: input.worldX ?? defaults.worldX,
    worldY: input.worldY ?? defaults.worldY,
    vx: input.vx ?? defaults.vx,
    vy: input.vy ?? defaults.vy,
    radius: input.radius ?? defaults.radius,
    health: input.health ?? defaults.health,
    maxHealth: input.maxHealth ?? defaults.maxHealth,
  };

  const asteroid = new Asteroid(asteroidData);

  asteroids.push(asteroid);
  return asteroid;
}

export function randomizeAsteroid() {
  const radius = randomRange(20, 25);
  return {
    worldX: randomRange(-600, 1400),
    worldY: randomRange(-600, 1400),
    vx: randomRange(-50, 50), // Allows multi-directional drifting values
    vy: randomRange(-50, 50),
    radius: radius,
    health: radius / 2 + 10,
    maxHealth: radius / 2 + 10,
  };
}

// one extra property: laserDamage, specifically for Laser
export class Laser extends Entity {
  laserDamage: number;
  constructor(data: {
    worldX: number;
    worldY: number;
    vx: number;
    vy: number;
    laserDamage: number;
  }) {
    // Pass the values up to the parent Entity constructor (filling x, y, width, height with 0 for now)
    super(0, 0, data.vx, data.vy, data.worldX, data.worldY);

    // 2. Set the unique laser property
    this.laserDamage = data.laserDamage;
  }

  getPadding(): number {
    return 0;
  }
  drawShape(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
  ): void {
    ctx.save();
    ctx.beginPath();
    // Draw a small bright neon red projectile line
    ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#ff3333";
    ctx.shadowColor = "#ff0000"; // Optional space arcade glow effect
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }
  fireLaser(laserSpeed: number, ship: Ship) {
    // Calculate velocity vectors based on the ship's current angle
    const vx = Math.cos(ship.angle) * laserSpeed;
    const vy = Math.sin(ship.angle) * laserSpeed;
    const laserData = {
      worldX: ship.x,
      worldY: ship.y,
      vx: vx,
      vy: vy,
      laserDamage: 1,
    };

    const newLaser = new Laser(laserData);

    activeLasers.push(newLaser);
  }
}


