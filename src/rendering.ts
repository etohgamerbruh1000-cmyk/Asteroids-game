// rendering.ts
// renders data shown. doesn't affect gameplay, only visuals!

import { state, GameState } from "./main.js";
import {
  buyNode,
  getNodeCost,
  getNodeEffect,
  upgradeLibrary,
} from "./skillTree.js";

export type Upgrade = (typeof upgradeLibrary)[keyof typeof upgradeLibrary];

// main helper function
// * WIP currently, as rendering isn't my top priority
export function render(): void {
  renderStats();
}

// Compact arrow function that returns the element
export const doc = (id: string) => document.getElementById(id) as HTMLElement;

export function renderStats(): void {
  doc("scrapCounter").textContent = `Scraps: ${state.currencies.scraps}`;
  doc("lengthsCounter").textContent = `Lengths: ${state.currentRun.lengths}L`;
}

//* main rendering function
export const renderUpgrade = (upgrade: Upgrade): void => {
  const upgButton = createUpgrade(upgrade);
  updateButtonText(upgrade, upgButton);

  upgButton.addEventListener("click", function () {
    const eligible = buyNode(upgrade);
    if (eligible) {
      updateButtonText(upgrade, upgButton);
    }
  });
};

// Extracted text updates so they can run repeatedly per level up
export function updateButtonText(upgrade: Upgrade, upgButton: HTMLElement) {
  const currentNode = state.nodes[upgrade.id];
  if (!currentNode) {
    console.warn("No node found");
    return;
  }

  const currentLevel = currentNode.level;
  // returns a boolean depending on if the clause is matching
  const isMaxed = currentLevel >= upgrade.maxLevel; // true/false

  const cost = isMaxed ? "MAXED" : `${getNodeCost(upgrade)} scraps`;
  const upgStat: keyof GameState["currencies"] = upgrade.affectedStat;
  upgButton.textContent = `${upgrade.name} (Lv ${currentLevel}/${upgrade.maxLevel}) | Cost: ${cost} | Effect: x${getNodeEffect(upgrade, upgStat)}`;
}

export function createUpgrade(upgrade: Upgrade) {
  const upgButton = document.createElement("button");
  upgButton.id = `button-${upgrade.id}`;
  doc("upgradeList").appendChild(upgButton);
  return upgButton;
}
