// ship.ts
// contains ship-related logic, ship is NOT a class since there is only one

import { addLaser, Laser } from "./entities.js";

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
  laserCooldown: number;
  lastFireTime: number;
}
export const ship: Ship = {
  x: 300,
  y: 400,
  thrust: { x: 0, y: 0 },
  radius: 15, // size in px
  angle: 0, // radians
  rotationSpeed: 0.01, // rad/tick
  isThrusting: false,
  laserCooldown: 500, // milliseconds
  lastFireTime: 0,
};

export function fireLaser(laserSpeed: number, ship: Ship) {
  // Calculate velocity vectors based on the ship's current angle
  const vx = Math.cos(ship.angle) * laserSpeed;
  const vy = Math.sin(ship.angle) * laserSpeed;
  const laserData = {
    worldX: ship.x,
    worldY: ship.y,
    vx: vx,
    vy: vy,
    laserDamage: 1,
  };

  const newLaser = new Laser(laserData);
  addLaser(newLaser);
}

const pressedKeys = new Set<string>();

window.addEventListener("keydown", (event) => {
  // absolute position, key location doesn't matter
  pressedKeys.add(event.code);

  if (pressedKeys.has("KeySpace")) {
    const now = performance.now();
    if (now - ship.lastFireTime >= ship.laserCooldown) {
      fireLaser(200, ship);
      ship.lastFireTime = now;
    }
  }
});

window.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.code);
});
// runs every game tick!!!
export function checkKeystroke() {
  const speed = 200;
  const rotationSpeed = 2;
  ship.thrust.x = 0;
  ship.thrust.y = 0;
  ship.rotationSpeed = 0;

  // TODO: Add actual acceleration instead of static force
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
  // rotationq
  if (pressedKeys.has("KeyQ")) {
    ship.rotationSpeed = rotationSpeed;
  }
  if (pressedKeys.has("KeyE")) {
    ship.rotationSpeed = -rotationSpeed;
  }
}

// moves coordinates, not actual x+y position
export function moveShipPosition(deltaTime: number) {
  ship.x += ship.thrust.x * deltaTime; // adjusts accordingly to fps
  ship.y += ship.thrust.y * deltaTime;

  ship.angle += ship.rotationSpeed * deltaTime;
}

// plural

// TODO: change param calling since i added activeLAsers
//* INFO: 5:30 PM,
export function cleanLaserArray(
  activeLasers: Laser[],
  canvas: HTMLCanvasElement,
  shipX: number,
  shipY: number,
) {
  for (let i = activeLasers.length - 1; i >= 0; i--) {
    const laser = activeLasers[i];

    // Calculate screen position relative to the camera/ship layout
    const screenX = laser.worldX - shipX + canvas.width / 2;
    const screenY = laser.worldY - shipY + canvas.height / 2;
    if (
      screenX < 0 ||
      screenX > canvas.width ||
      screenY < 0 ||
      screenY > canvas.height
    ) {
      activeLasers.splice(i, 1);
    }
  }
}

// used for init just for a clean codebase :D
export function drawShip(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  ship: Ship,
) {
  ctx.save(); // 1. Save the clean, normal canvas state
  ctx.translate(centerX, centerY);
  ctx.rotate(ship.angle);

  ctx.beginPath();

  ctx.moveTo(15, 0);
  ctx.lineTo(-10, -10);
  ctx.lineTo(-10, 10);
  ctx.closePath();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}
