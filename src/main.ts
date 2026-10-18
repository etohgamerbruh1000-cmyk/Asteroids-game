// main.ts
// loads up the game loop and initialization

import { createAsteroid } from "./entities/entities.js";
import { gameLoop } from "./entities/gameLoop.js";
import { renderUpgrade, render } from "./rendering.js";
import { upgradeLibrary } from "./skillTree.js";

// safeguard for html content loading to prevent errors with initialization
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");

  if (ctx && canvas) {
    // 1. Generate buttons
    Object.values(upgradeLibrary).forEach(renderUpgrade);
    // 2. Create 100 asteroids on canvas, using default (randomized properties)
    for (let i = 0; i < 100; i++) {
      createAsteroid();
    }
    render();

    // Start drawing the game loop
    requestAnimationFrame((currentTime) => gameLoop(canvas, ctx, currentTime));
  } else {
    console.warn("Could not find canvas and 2d context");
  }
});

// ============================================================================
// * 1. FUNCTIONS!!!!
// ============================================================================

// uses circle collision instead of squares!
export function checkCollision(
  laser: { worldX: number; worldY: number },
  ast: { worldX: number; worldY: number; radius: number },
) {
  const dx = laser.worldX - ast.worldX;
  const dy = laser.worldY - ast.worldY;

  // uses squares instead of sqrts for optimization
  return dx * dx + dy * dy < ast.radius * ast.radius;
}

// Overload signatures (Only define types here, no default values!)
export function increaseStat<K extends keyof GameState["currencies"]>(
  state: GameState,
  category: "currencies",
  key: K,
  amount?: number, // Use optional marker '?' instead of '= 1'
): void;

export function increaseStat<K extends keyof GameState["currentRun"]>(
  state: GameState,
  category: "currentRun",
  key: K,
  amount?: number,
): void;

// Implementation signature (Define default values and use 'as any' here)
export function increaseStat(
  state: GameState,
  category: "currencies" | "currentRun",
  key: string,
  amount = 1,
) {
  // Cast the sub-object as a Record mapping string keys to number values
  const targetCategory = state[category] as Record<string, number>;

  // Safely check if the key exists before adding to avoid NaN errors
  if (key in targetCategory) {
    targetCategory[key] += amount;
  } else {
    console.warn(`Key "${key}" does not exist in state.${category}`);
  }

  render();
  console.log(`Gained ${amount} ${key}!`);
}

export interface GameState {
  runtimeState: Record<string, number>;
  currencies: {
    asteroidsDestroyed: number;
    scraps: number;
    scrapMult: number;
    thrustEnergy: number;
  };
  currentRun: {
    lengths: number;
  };
  nodes: Record<`N${number}`, { level: number; id: string }>;
}

export const state: GameState = {
  runtimeState: {},
  currencies: {
    asteroidsDestroyed: 0,
    scraps: 0,
    scrapMult: 1,
    thrustEnergy: 100,
  },
  currentRun: {
    lengths: 0,
  },
  // Generates N1 through N10 automatically with matching IDs
  nodes: Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => {
      const id = `N${i + 1}`;
      return [id, { level: 0, id }];
    }),
  ) as GameState["nodes"],
};
