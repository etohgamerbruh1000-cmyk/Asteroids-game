export interface GameState {
  runtimeState: Record<string, number>;
  currencies: {
    asteroidsDestroyed: number;
    scraps: number;
    thrustEnergy: number;
  };
  currentRun: {
    lengths: number;
  };
  nodes: Record<`N${number}`, { level: number }>;
}

export const state: GameState = {
  runtimeState: {},
  currencies: {
    asteroidsDestroyed: 0,
    scraps: 0,
    thrustEnergy: 100,
  },
  currentRun: {
    lengths: 0,
  },
  // Generates N1 through N10 automatically
  nodes: Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [`N${i + 1}`, { level: 0 }]),
  ) as GameState["nodes"],
};
