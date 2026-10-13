// gameLoop.ts
// handles gameLoop, deltaTime

import { drawAsteroid } from "../rendering.js";
import { asteroids, tickAsteroid } from "./asteroid.js";
import { addPhysics, moveShipPosition, ship } from "./ship.js";

// high-precision timestamp of current timestamp
let previousTime = performance.now();

export function calculateDeltaTime(currentTime: number) {
  const deltaTime = (currentTime - previousTime) / 1000;
  previousTime = currentTime;
  return deltaTime;
}

// main helper function

// TODo: 9:54 PM: TURN GAMELOOP INTO AN ARROW FUNCTION WRAPPER!!!
export function gameLoop(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  currentTime: number,
): void {
  const deltaTime = calculateDeltaTime(currentTime);
  // TODO: make currentTime have a purpose, with asteroids
  // TODO: slowly rotating and moving via delytaTime
  addPhysics();
  moveShipPosition(deltaTime);
  // gaurd clause
  if (!ctx || !canvas) {
    console.warn("No ctx");
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // rendering

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // render ship upon domCOntentLoaded
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 15);
  ctx.lineTo(centerX - 10, centerY + 10);
  ctx.lineTo(centerX + 10, centerY + 10);

  ctx.closePath();
  ctx.stroke();

  for (const ast of asteroids) {
    tickAsteroid(deltaTime, ast);
    drawAsteroid(canvas, ctx, ast, ship.x, ship.y);
  }

  requestAnimationFrame(gameLoop);
}
