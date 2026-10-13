## README.md

Documentation for Asteroids ( ADD MORE LATER )

### IMPORTANT
this is a game made in vanilla TypeScript, with it being my first project to be written in Typescript!

all of this is WIP, please try to treat my code as if it is going to change or get reworked.

### 1. Controls

W -> accelerate forward
S -> accelerate backward / brake
A -> strafe left
D -> strafe right

Q -> rotate left
E -> rotate right

Space -> shoot
Shift -> special thrust/boost

## 1. Planning
The game “Asteroids” is a game made in TypeScript, with it intentionally being less code-heavy to free me from development hell. It is a 2D game that allows you to thrust your ship and delete asteroids while maintaining a score and trying to manage a skill tree. The key systems are:

### Unorthodox movement
You wrap around walls, just like in normal asteroids games, but you don;t have friction. Instead, the game is like a platformer, where it makes you move according to the key pressed. When you shoot a laser, the laser gets shot according to the ship's rotation.

### Currency
Upon hitting an asteroid and dying in the current run, you gain scraps depending on how far you traveled in 50 pixels. 50px = “length”, for example, 150px traveled is equivalent to 3 lengths. Scraps are going to be inside some conversion formula based on lengths. You can also gain scraps based on asteroids killed.

You can invest in a skill tree of sorts to increase thrust, decrease asteroid spawn,... There are 10-20 planned nodes.

#### Ship thrust
Your ship can thrust, gaining speed upon activating it. This is one of the key factors that can improve your currency generation. It gets expanded upon in the skill tree, giving it buffs like a wind shield when activated, or lesser cooldowns,..

You have a limited amount of thrust energy. Whenever you thrust, your energy goes down faster. If you are close to dying, you can just speed through by holding a key (current plan: shift but it is subject to change), when you release you slow down to your original speed. 

Hold shift for a long time -> Go faster
Release shift -> Go to your original speed
Hold shift -> nothing, you wasted your energy.

### Asteroid abilities+types
Asteroids can sometimes mutate and try to harm your ship, for example it can give poison, debuff the ship, and even reduce max speed. You will need to purchase antibiotics to occasionally throw at the asteroids, and the asteroids will break down / lose their ability upon throw based on the antibiotics’ effect
Antibiotics become more expensive based on power and type, micromanage them or else you will be in it for a long time

Asteroids spawn with no mutation near 0-1,000 lengths
shipDebuff, shipPoison mutations spawn near 1,001-5,000 lengths
After 5,000 lengths, all mutations have an increasingly bigger chance to spawn based on length and all mutations can spawn.


The endgame is reached upon 1,000 asteroids killed AND 10,000 lengths, after that you get to face a final boss before reaching the end screen.
The game’s length will be around 30m-1+1/2h long
Intended development time: 10h active, 3 weeks inactive

The game uses <canvas> elements
Upgrade UI is built using HTML, not drawn in the canvas

## 2. Architectural decisions

File structure is intended to be around 7-15 files, regarding my statement about making the game less heavy.

My proposed file structure:
├── index.html
├── style.css
└── src/
    ├── main.ts         # Setup, animation loop, input listeners, and state initialization
    ├── state.ts        # Game state, inventory, currency, and Skill Tree definitions
    ├── engine.ts       # Physics (wrapping/movement) and Canvas rendering functions
    └── entities/
        ├── ship.ts       # Ship physics, movement, and shield logic
        ├── asteroid.ts   # Asteroid movement, mutation types, and splitting logic
        └── antibiotic.ts # Antibiotic weapon logic, rendering, and collision radius
