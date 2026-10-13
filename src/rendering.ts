// rendering.ts
// renders data shown. doesn't affect gameplay, only visuals!

import { Asteroid } from "./entities/asteroid.js";
import { buyNode, upgradeLibrary } from "./skillTree.js";
import { state } from "./state.js";
export type Upgrade = (typeof upgradeLibrary)[keyof typeof upgradeLibrary];

// main helper function
export function render(): void {
  renderStats();
}

// Compact arrow function that returns the element
export const doc = (id: string) => document.getElementById(id) as HTMLElement;

export function renderStats(): void {
  doc("lengthsCounter").textContent = `Scraps: ${state.currencies.scraps}`;
  doc("scrapCounter").textContent = `Lengths: ${state.currentRun.lengths}`;
}

// main rendering function
export const renderUpgrade = (upgrade: Upgrade): void => {
  const upgButton = createUpgrade(upgrade);
  appendUpgradeText(upgrade, upgButton);

  upgButton.addEventListener("click", function () {
    const eligible = buyNode(upgrade);
    if (eligible) {
      updateButtonText(upgrade, upgButton);
    }
  });
};

// TODO: REthink this bruh
// Extracted text updates so they can run repeatedly per level up
export function updateButtonText(upgrade: Upgrade, upgButton: HTMLElement) {
  const currentNode = state.nodes[upgrade.id];
  if (!currentNode) return;

  const currentLevel = currentNode.level;
  const isMaxed = currentLevel >= upgrade.maxLevel;

  const cost = isMaxed
    ? "MAXED"
    : `${upgrade.costFormula(currentLevel)} scraps`;
  const effect = upgrade.effectFormula(currentLevel);

  upgButton.textContent = `${upgrade.name} (Lv ${currentLevel}/${upgrade.maxLevel}) | Cost: ${cost} | Effect: +${effect}`;
}

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
    console.error("No node available.");

    return;
  }
  const cost: number = upgrade.costFormula(currentNode.level + 1);
  const effect = upgrade.effectFormula(currentNode.level + 1);
  upgButton.textContent = `Cost: ${cost} scraps.
  Effect: ${effect}`;
  doc("upgradeList").appendChild(upgButton);
}

// ==================
//* 2. Game rendering
// ==================

// main drawing function with relatuve scrolling equipped into it!
export function drawAsteroid(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  asteroid: Asteroid,
  shipX: number,
  shipY: number,
) {
  const padding: number = asteroid.radius;

  const screenX: number = asteroid.worldX - shipX + canvas.width / 2;
  const screenY: number = asteroid.worldY - shipY + canvas.height / 2;
  // relativ scrolling system
  if (
    screenX < -padding ||
    screenX > canvas.width + padding ||
    screenY < -padding ||
    screenY > canvas.height + padding
  ) {
    // hides the asteroid and skips rendering
    return;
  } else {
    ctx.beginPath();
    ctx.arc(screenX, screenY, asteroid.radius, 0, Math.PI * 2);
    // optional aestethics
    ctx.fillStyle = "white";
    ctx.fill();
  }
}
