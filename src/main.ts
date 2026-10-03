// main.js

import { gameLoop } from "./entities/gameLoop.js";
import { ship } from "./entities/ship.js";
import { doc, drawShip, render, renderUpgrade } from "./rendering.js";
import { upgradeLibrary } from "./skillTree.js";

// TODO: add increaseStat, typescript is giving me weird errors

//* === ABSOLUTE BOTTOM ===
// runtime rendering
window.addEventListener("DOMContentLoaded", () => {
  const canvas = doc("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    drawShip(ctx, ship);
    Object.values(upgradeLibrary).forEach(renderUpgrade);
  } else {
    console.log("ctx not found:", ctx);
  }
});

requestAnimationFrame(gameLoop);
render();
