// gameLoop.ts
// handles gameLoop, deltaTime

import { checkCollision } from "../main.js";
import { drawAsteroid, drawLaser } from "../rendering.js";
import { asteroids, tickAsteroid } from "./asteroid.js";
import {
  activeLasers,
  checkKeystroke,
  cleanLaserArray,
  moveShipPosition,
  ship,
  tickLaser,
} from "./ship.js";

// high-precision timestamp of current timestamp
let previousTime = performance.now();

export function calculateDeltaTime(currentTime: number) {
  const deltaTime = (currentTime - previousTime) / 1000;
  previousTime = currentTime;
  return deltaTime;
}

//* main helper function
// it is an arrow function because it needs 3 params,
// meaning that the requestAnimFrame cannot hold 2+ params
export const gameLoop = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  currentTime: number,
): void => {
  const deltaTime = calculateDeltaTime(currentTime);
  checkKeystroke();
  moveShipPosition(deltaTime);
  // gaurd clause
  if (!ctx || !canvas) {
    console.warn("No ctx");
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rendering the ship on the canvas
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.save(); // 1. Save the clean, normal canvas state
  ctx.translate(centerX, centerY);
  ctx.rotate(ship.angle);

  ctx.beginPath();

  ctx.moveTo(15, 0);
  ctx.lineTo(-10, -10);
  ctx.lineTo(-10, 10);
  ctx.closePath();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  for (const ast of asteroids) {
    tickAsteroid(deltaTime, ast);
    drawAsteroid(canvas, ctx, ast, ship.x, ship.y);
  }

  for (const laser of activeLasers) {
    tickLaser(deltaTime, laser);
  }
  cleanLaserArray(canvas, ship.x, ship.y);
  for (const laser of activeLasers) {
    drawLaser(canvas, ctx, laser, ship.x, ship.y);
     checkCollision(laser, ast)
  }

  requestAnimationFrame((currentTime) => gameLoop(canvas, ctx, currentTime));
};
