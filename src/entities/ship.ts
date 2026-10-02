// ship.ts

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

export interface Ship {
  x: number;
  y: number;
  radius: number;
  angle: number;
  rotationSpeed: number;
  thrust: {
    x: number;
    y: number;
  };
  isThrusting: boolean;
}
export const ship: Ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  thrust: { x: 0, y: 0 },
  radius: 15, // radians
  angle: 0,
  rotationSpeed: 0,
  isThrusting: false,
};

// TODO: Add Set

const pressedKeys = new Set<string>();

window.addEventListener("keydown", (event) => {
  pressedKeys.add(event.key);
});

window.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.key);
});

// runs every tick
export function addPhysics() {
  const speed = 5;
  ship.thrust.x = 0;
  ship.thrust.y = 0;
  if (pressedKeys.has("w")) {
    ship.thrust.y = -speed;
  }

  if (pressedKeys.has("a")) {
    ship.thrust.y = speed;
  }

  if (pressedKeys.has("s")) {
    ship.thrust.x = speed;
  }

  if (pressedKeys.has("d")) {
    ship.thrust.x = speed;
  }
}

export function applyMovement() {
  ship.x += ship.thrust.x;
  ship.y += ship.thrust.y;
}
