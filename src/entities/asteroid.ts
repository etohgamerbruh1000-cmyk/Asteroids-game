export interface Asteroid {
  worldX: number;
  worldY: number;
  vx: number; // Its own drift velocity X
  vy: number; // Its own drift velocity Y
  radius: number;
}
// 1. Maintain a global or module-scoped state array
export const asteroids: Asteroid[] = [];

// helper API for a random range
const randomRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export function createAsteroid(input: Partial<Asteroid> = {}): Asteroid {
  const defaults = randomizeAsteroid();

  const asteroid: Asteroid = {
    worldX: input.worldX ?? defaults.worldX,
    worldY: input.worldY ?? defaults.worldY,
    vx: input.vx ?? defaults.vx,
    vy: input.vy ?? defaults.vy,
    radius: input.radius ?? defaults.radius,
  };

  asteroids.push(asteroid);
  return asteroid;
}
// put this into main.ts
export function randomizeAsteroid() {
  return {
    worldX: randomRange(-600, 1400),
    worldY: randomRange(-600, 1400),
    vx: randomRange(-50, 50), // Allows multi-directional drifting values
    vy: randomRange(-50, 50),
    radius: randomRange(20, 25),
  };
}

// updates worldPos for asteroid, based on deltaTime
export function tickAsteroid(deltaTime: number, asteroid: Asteroid) {
  asteroid.worldX += asteroid.vx * deltaTime;
  asteroid.worldY += asteroid.vy * deltaTime;

  return asteroid;
}

