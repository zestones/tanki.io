# Multiplayer Tank Game

A simple multiplayer tank game inspired by diep.io, built with React, Colyseus, and Tailwind CSS.

## Features

- Real-time multiplayer gameplay
- Separate controller and game screen views
- Tank movement and shooting mechanics
- Health system and respawning
- Mobile-friendly controls

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Game

1. Start the server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the client:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to:
   - Game Screen: http://localhost:5173/game
   - Controller: http://localhost:5173 (enter username first)

## How to Play

1. Open the game screen (http://localhost:5173/game) on a shared display or separate browser window
2. Players join by visiting http://localhost:5173 on their devices and entering their usernames
3. Use the controller interface to move your tank and shoot
4. Avoid enemy bullets and try to hit other players
5. When hit, you lose 1 HP (starting with 3)
6. At 0 HP, you'll respawn after 3 seconds

## Controls

- Arrow buttons: Move tank (Up, Down, Left, Right)
- Shoot button: Fire bullets in the direction you're facing
- Tank automatically faces the direction of movement
