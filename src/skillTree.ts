// skillTree.ts

import { state, type GameState } from "./state.js";

// handles static definitions, purchasing
// FIXME: rework upgrades to be better and more diverse
// TODO: fix me plssssss

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

// main function
export function buyNode(node: UpgradeNode): boolean {
  if (!checkUpgradeEligibility(node)) {
    return false;
  }

  applyNodeEffect(node);
  depleteCosts(node);
  return true;
}

function getNodeLevel(node: UpgradeNode): number {
  return state.nodes[node.id].level
}

function getNodeCost(node: UpgradeNode): number {
  const level = getNodeLevel(node);
  return Math.floor(node.baseCost * node.costFormula(level));
}

export function applyNodeEffect(node: UpgradeNode): number {
  const nextLevel = getNodeLevel(node) + 1;
state.nodes[node.id].level // TODo: FIX
  return nextLevel
}

export function depleteCosts(node: UpgradeNode): number {
  const cost = getNodeCost(node);
  state.currencies.scraps = Math.max(0, state.currencies.scraps - cost);
  return state.currencies.scraps;
}

export function checkUpgradeEligibility(node: UpgradeNode): boolean {
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
