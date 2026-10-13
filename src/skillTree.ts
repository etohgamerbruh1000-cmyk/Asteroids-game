// skillTree.ts

// handles static definitions, purchasing
// TODO: FIXME: rework upgrades to be better and more diverse
// TODO: fix me plssssss

import { state, type GameState } from "./state.js";

type UpgradeNodeId = keyof GameState["nodes"];

interface UpgradeNode {
  id: UpgradeNodeId;
  name: string;
  maxLevel: number;
  baseCost: number;
  costFormula: (level: number) => number;
  effectFormula: (level: number) => number;
}

type UpgradeLibrary = Record<UpgradeNodeId, UpgradeNode>;

export const upgradeLibrary: UpgradeLibrary = {
  N1: {
    id: "N1",
    name: "heavy-fuel-injection",
    maxLevel: 5,
    baseCost: 100,
    costFormula: (level) => 100 + level * 30,
    effectFormula: (level) => level * 1.5,
  },
};

//* main function to buy a node.
export function buyNode(node: UpgradeNode): boolean {
  // 1. Checks for cost, maxed, and returns true if none match
  if (!checkUpgradeEligibility(node)) {
    return false;
  }

  // 2. appplies node effect, depletes cost
  applyNodeEffect(node);
  depleteCosts(node);
  return true;
}

export function checkUpgradeEligibility(node: UpgradeNode): boolean {
  // 1. Guard clause
  if (!node) {
    return false;
  }

  const currentLevel = getNodeLevel(node);
  if (currentLevel >= node.maxLevel) {
    return false;
  }

  const cost = getNodeCost(node);
  return state.currencies.scraps >= cost;
}

export function applyNodeEffect(node: UpgradeNode): number {
  const nextLevel = getNodeLevel(node) + 1;
  state.nodes[node.id].level += 1;
  return nextLevel;
}

export function depleteCosts(node: UpgradeNode): number {
  const cost = getNodeCost(node);
  state.currencies.scraps = Math.max(0, state.currencies.scraps - cost);
  return state.currencies.scraps;
}

function getNodeLevel(node: UpgradeNode): number {
  return state.nodes[node.id].level;
}

function getNodeCost(node: UpgradeNode): number {
  const level = getNodeLevel(node);
  return Math.floor(node.baseCost * node.costFormula(level));
}
