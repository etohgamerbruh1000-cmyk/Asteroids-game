// gameLoop.ts
// handles gameLoop, deltaTime

import { checkCollision } from "../main.js";
import {
  activeLasers,
  Asteroid,
  asteroids,
  cleanLasers,
  gameEntities,
  Laser,
} from "./entities.js";
import {
  checkKeystroke,

  drawShip,
  moveShipPosition,
  ship,
} from "./ship.js";

// high-precision timestamp of current timestamp
let previousTime = performance.now();

export function calculateDeltaTime(currentTime: number) {
  const deltaTime = (currentTime - previousTime) / 1000;
  previousTime = currentTime;
  return deltaTime;
}
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
//* main helper function
// it is an arrow function because it needs 3 params,
// meaning that the requestAnimFrame cannot hold 2+ params
export const gameLoop = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  currentTime: number,
): void => {
  const deltaTime = calculateDeltaTime(currentTime);

  // 1. checks which key is being pressed and moves ship accordingly
  checkKeystroke();
  moveShipPosition(deltaTime);

  if (!ctx || !canvas) {
    console.warn("No ctx");
    return;
  }

  // 2. clears canvas to prevent infinite trail of old frames
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Initialization of variables

  // Draws ship; just for clean codebase
  drawShip(ctx, centerX, centerY, ship);

  cleanLasers(activeLasers, canvas, ship.x, ship.y);

  gameEntities.all.forEach((ent) => {
    if (ent instanceof Asteroid) {
      // Alias 'ent' to 'ast' so your existing code works perfectly
      const ast = ent;
      if (!ast.checkDeath()) {
        ast.tick(deltaTime);
        ast.render(canvas, ctx, ship.x, ship.y);
        ast.drawHealthBar(canvas, ctx, ship.x, ship.y);
      }
    } else if (ent instanceof Laser) {
      // Alias 'ent' to 'laser'
      const laser = ent;

      laser.tick(deltaTime);
      laser.render(canvas, ctx, ship.x, ship.y);

      // 2. Check this specific laser against ALL asteroids
      for (const ast of asteroids) {
        if (checkCollision(laser, ast)) {
          ast.health -= laser.laserDamage;
          // *, but there will be a laser thing where it bounces off of asteroids
        }
      }
    }
  });

  requestAnimationFrame((timestamp) => gameLoop(canvas, ctx, timestamp));
};

gameEntities.all = gameEntities.all.filter((ent) => {
  if (ent instanceof Asteroid)
const dead = 

})