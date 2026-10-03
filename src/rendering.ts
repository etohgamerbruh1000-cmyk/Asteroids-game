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
  doc("scrapCounter").textContent = `Lengths: ${state.currentRun.lengths}`;
}

// main rendering function
export const renderUpgrade = (upgrade: Upgrade) => {
  const upgButton = createUpgrade(upgrade);
  appendUpgradeText(upgrade, upgButton);
};

export function createUpgrade(upgrade: Upgrade) {
  const upgButton = document.createElement("button");
  upgButton.id = `button-${upgrade.id}`;

  return upgButton;
}

export function appendUpgradeText(upgrade: Upgrade, upgButton: HTMLElement) {
  if (!upgrade || !upgButton) {
    console.warn("No button or adom element for button, rendering,ts:38");
    return; // Case if a node is missing or mistyped
  }
  const currentNode = state.nodes[upgrade.id];
  if (!currentNode) {
    console.error("Nagget party");

    return;
  }
  const cost: number = upgrade.costFormula(currentNode.level + 1);
  const effect = upgrade.effectFormula(currentNode.level + 1);
  upgButton.textContent = `Cost: ${cost} scraps.
  Effect: ${effect}`;
  doc("upgradeList").appendChild(upgButton);
}

// Renders the player ship on the canvas.
export function drawShip(ctx: CanvasRenderingContext2D, ship: Ship): void {
  ctx.beginPath();
  ctx.moveTo(ship.x, ship.y - 15);
  ctx.lineTo(ship.x - 10, ship.y + 10);
  ctx.lineTo(ship.x + 10, ship.y + 10);
  ctx.closePath();
  ctx.stroke();
}
