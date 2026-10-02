// asteroid.ts

// TODO: Fix, may have some weird putdated code

class Asteroid {
  x: number;
  y: number;
  size: number;
  speed: number;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = Math.random() * 2 + 1; // Random speed
  }

  // Each asteroid knows how to move itself
  update() {
    this.y += this.speed; // Move downward
  }
}

// Spawning 100 asteroids is easy:
const asteroids: Asteroid[] = [];
for (let i = 0; i < 100; i++) {
  asteroids.push(new Asteroid(Math.random() * 800, 0, 20));
}

// In your game loop:
function gameLoop() {
  asteroids.forEach((asteroid) => asteroid.update());
}
