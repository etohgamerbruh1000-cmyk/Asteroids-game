// state.ts

// state.ts
export interface GameState {
  runtimeState: Record<string, any>;
  currencies: {
    asteroidsDestroyed: number;
    scraps: number;
    thrustEnergy: number;
  };
  currentRun: {
    lengths: number;
  };
  nodes: {
    N1: number;
    N2: number;
    N3: number;
    N4: number;
    N5: number;
    N6: number;
    N7: number;
    N8: number;
    N9: number;
    N10: number;
  };
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
  nodes: {
    N1: 0,
    N2: 0,
    N3: 0,
    N4: 0,
    N5: 0,
    N6: 0,
    N7: 0,
    N8: 0,
    N9: 0,
    N10: 0,
  },
};








