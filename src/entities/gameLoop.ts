// gameLoop.ts

import { ship } from "./ship";

// high-precision timestamp of current timestamp
let previousTime = performance.now();

export function calculateDeltaTime(currentTime: number) {
  const deltaTime = (currentTime - previousTime) / 1000;
  previousTime = currentTime;
  return deltaTime;
}

export function moveShip(deltaTime: number) {
  ship.x += ship.thrust.x * deltaTime; // adjusts accordingly to fps
  ship.y += ship.thrust.y * deltaTime;
}

// main helper function
export function gameLoop(currentTime: number) {
  const deltaTime = calculateDeltaTime(currentTime);
  moveShip(deltaTime);
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
