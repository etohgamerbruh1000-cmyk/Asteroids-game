// skillTree.ts
// handles static definitions, purchasing nodes!

import { state, type GameState } from "./main.js";

// TODO: FIXME: rework upgrades to be better and more diverse
// TODO: work on this.

type UpgradeNodeId = keyof GameState["nodes"];

interface UpgradeNode {
  id: UpgradeNodeId;
  name: string;
  maxLevel: number;
  baseCost: number;
  affectedStat: string;
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
    affectedStat: "thrustEnergy",
    costFormula: (level) => 1 + level * 0.3, // mult to baseCost
    effectFormula: (level) => level * 1.5,
  },
  // ADD MORE LATER: I want to fix rendering
};

//* main function to buy a node, contains mainly helper functions
export function buyNode(node: UpgradeNode): boolean {
  // 1. Checks for cost, maxed, and returns true if none match
  if (!checkUpgradeEligibility(node)) {
    return false;
  }

  // 2. applies node effect, depletes cost
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

  // 2. max level checking
  if (currentLevel >= node.maxLevel) {
    return false;
  }

  const cost = getNodeCost(node);
  // 3. boolean for checking if an upgrade is affordable
  return state.currencies.scraps >= cost;
}

export function applyNodeEffect(node: UpgradeNode): number {
  const nextLevel = getNodeLevel(node) + 1;
  state.nodes[node.id].level += 1;
  // TODO: Apply effect, not just add 1 to the level
  //* no different operations; multiplication is basically most of it anyways.
  const upgStat: keyof GameState["currencies"] = node.affectedStat;
  state.currencies[upgStat] *= (getNodeEffect(node, upgStat) ?? 1)
  return nextLevel;
}

export function getNodeEffect(
  node: UpgradeNode,
  upgStat: keyof GameState["currencies"],
) {
  if (upgStat in state.currencies) {
    const matchingNode = Object.values(state.nodes).find(
      (u) => u.id === state.nodes[node.id].id,
    );
    if (!matchingNode) {
      console.warn("No matching node :(");
      return;
    }

    return node.effectFormula(matchingNode.level);
  }
}

export function depleteCosts(node: UpgradeNode): number {
  const cost = getNodeCost(node);
  state.currencies.scraps = Math.max(0, state.currencies.scraps - cost);
  return state.currencies.scraps;
}

function getNodeLevel(node: UpgradeNode): number {
  return state.nodes[node.id].level;
}

export function getNodeCost(node: UpgradeNode): number {
  const level = getNodeLevel(node);
  return Math.floor(node.baseCost * node.costFormula(level));
}
