// rendering.ts
// renders data shown. doesn't affect gameplay, only visuals!

import { Laser } from "./entities/ship.js";
import { Asteroid } from "./entities/entities.js";
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

// TODO: Think about this archu=itecture, pasted by ai since i was too lazy
// Extracted text updates so they can run repeatedly per level up
export function updateButtonText(upgrade: Upgrade, upgButton: HTMLElement) {
  const currentNode = state.nodes[upgrade.id];
  if (!currentNode) return;

  const currentLevel = currentNode.level;
  const isMaxed = currentLevel >= upgrade.maxLevel;

  const cost = isMaxed
    ? "MAXED"
    : `${upgrade.costFormula(currentLevel + 1)} scraps`;
  const effect = upgrade.effectFormula(currentLevel);

  upgButton.textContent = `${upgrade.name} (Lv ${currentLevel}/${upgrade.maxLevel}) | Cost: ${cost} | Effect: +${effect}`;
}

export function createUpgrade(upgrade: Upgrade) {
  const upgButton = document.createElement("button");
  upgButton.id = `button-${upgrade.id}`;

  return upgButton;
}

export function appendUpgradeText(upgrade: Upgrade, upgButton: HTMLElement) {
  // guard clause if a node is missing or mistyped
  if (!upgrade || !upgButton) {
    console.warn("No button or DOM element for button");
    return;
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
