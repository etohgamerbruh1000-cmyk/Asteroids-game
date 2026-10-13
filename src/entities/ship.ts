// ship.ts

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
  x: 300,
  y: 400,
  thrust: { x: 0, y: 0 },
  radius: 15, // radians
  angle: 0,
  rotationSpeed: 0,
  isThrusting: false,
};

// TODO: Add Set

const pressedKeys = new Set<string>();

window.addEventListener("keydown", (event) => {
  // absolute position, key location doesn't matter
  pressedKeys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.code);
});

// runs every game tick
export function addPhysics() {
  const speed = 200;
  ship.thrust.x = 0;
  ship.thrust.y = 0;

  if (pressedKeys.has("KeyW")) {
    ship.thrust.y = -speed;
  }
  if (pressedKeys.has("KeyS")) {
    ship.thrust.y = speed;
  }
  if (pressedKeys.has("KeyA")) {
    ship.thrust.x = -speed;
  }
  if (pressedKeys.has("KeyD")) {
    ship.thrust.x = speed;
  }
}

// moves coordinates, not
export function moveShipPosition(deltaTime: number) {
  ship.x += ship.thrust.x * deltaTime; // adjusts accordingly to fps
  ship.y += ship.thrust.y * deltaTime;
}

export function fireLaser() {
  // TODO: Add this
}
