// rendering.ts

import { ship, Ship } from "./entities/ship.js";
import { upgradeLibrary } from "./skillTree.js";
import { state } from "./state.js";
export type Upgrade = (typeof upgradeLibrary)[keyof typeof upgradeLibrary];

// main helper function
export function render() {
  renderStats();
}

// Compact arrow function that returns the element
export const doc = (id: string) => document.getElementById(id) as HTMLElement;

export function renderStats() {
  doc("lengthsCounter").textContent = `Scraps: ${state.currencies.scraps}`;
  doc("scrapCounter").textContent = `Scraps: ${state.currentRun.lengths}`;
}

// main rendering function
export const renderUpgrade = (upgrade: Upgrade) => {
  createUpgrade(upgrade);
  appendUpgradeText(upgrade, createUpgrade(upgrade));
};

export function createUpgrade(upgrade: Upgrade) {
  const upgButton = document.createElement("button");
  upgButton.id = `button-${upgrade.id}`;

  return upgButton;
}

export function appendUpgradeText(upgrade: Upgrade, upgButton: HTMLElement) {
  const matchingNode = `${upgrade.id}`;
  const cost = upgrade.costFormula(state.nodes[matchingNode]);
  const effect = upgrade.effectFormula(state.nodes[matchingNode]);
  upgButton.textContent = `Cost: ${cost} scraps.
  Effect: ${effect}`;
  upgButton.appendChild(doc("upgrade-list"));
}

// Renders the player ship on the canvas.
function drawShip(ctx: CanvasRenderingContext2D, ship: Ship): void {
  ctx.beginPath();
  ctx.moveTo(ship.x, ship.y - 15);
  ctx.lineTo(ship.x - 10, ship.y + 10);
  ctx.lineTo(ship.x + 10, ship.y + 10);
  ctx.closePath();
  ctx.stroke();
}

//* === ABSOLUTE BOTTOM ===
// runtime rendering
const canvas = doc("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (ctx) {
  drawShip(ctx, ship);
  Object.values(upgradeLibrary).forEach(renderUpgrade);
} else {
  console.log("ctx not found:", ctx);
}
