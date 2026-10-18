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

// 1. Declare cache variables at the top of the file using 'let'
let cachedScrap: HTMLElement | null = null;
let cachedLengths: HTMLElement | null = null;

export function renderStats(): void {
  // 2. Fetch the elements ONLY if they haven't been cached yet
  if (!cachedScrap) {
    cachedScrap = document.getElementById("scrapCounter");
  }
  if (!cachedLengths) {
    cachedLengths = document.getElementById("lengthsCounter");
  }

  // 3. Update the text content safely
  if (cachedScrap) {
    cachedScrap.textContent = `Scraps: ${state.currencies.scraps}`;
  }
  if (cachedLengths) {
    cachedLengths.textContent = `Lengths: ${state.currentRun.lengths}L`;
  }
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
  const upgStat = upgrade.affectedStat as keyof GameState["currencies"];
  upgButton.textContent = `${upgrade.name} (Lv ${currentLevel}/${upgrade.maxLevel}) | Cost: ${cost} | Effect: x${getNodeEffect(upgrade, upgStat)}`;
}

export function createUpgrade(upgrade: Upgrade) {
  const upgButton = document.createElement("button");
  upgButton.id = `button-${upgrade.id}`;
  doc("upgradeList").appendChild(upgButton);
  return upgButton;
}
