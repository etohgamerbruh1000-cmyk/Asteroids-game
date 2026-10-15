// main.ts
import { createAsteroid } from "./entities/asteroid.js";
import { gameLoop } from "./entities/gameLoop.js";
import {} from "./entities/ship.js";
import { renderUpgrade, render } from "./rendering.js";
import { upgradeLibrary } from "./skillTree.js";

// safeguard for html content loaded
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");

  if (ctx && canvas) {
    // 1. Generate buttons
    Object.values(upgradeLibrary).forEach(renderUpgrade);
    // 2. Create 100 asteroids on canvas, using default (randomized properties)
    for (let i = 0; i < 100; i++) {
      createAsteroid();
    }
    render();

    // Start drawing the game loop
    requestAnimationFrame((currentTime) => gameLoop(canvas, ctx, currentTime));
  } else {
    console.warn("Could not find canvas and 2d context");
  }
});

interface GeometryObject {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  [key: string]: unknown;
}
// main function using bounding-box collision
//* FIXME: Fix these bugs
export function checkCollision(hitter: GeometryObject, target: GeometryObject) {
  if (
    hitter.x !== undefined &&
    hitter.y !== undefined &&
    hitter.width !== undefined &&
    hitter.height !== undefined &&
    target.x !== undefined &&
    target.y !== undefined &&
    target.width !== undefined &&
    target.height !== undefined
  ) {
    return (
      hitter.x < target.x + target.width &&
      hitter.x + hitter.width > target.x &&
      hitter.y < target.y + target.height &&
      hitter.y + hitter.height > target.y
    );
    return false;
  }
}
