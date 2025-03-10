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

3. Configure the client for your local network (optional):
```bash
cd client/src
cp ipConfig.template.js ipConfig.js
```
   Then edit `ipConfig.js` and replace `YOUR_LOCAL_IP_ADDRESS` with your actual local IP address.

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

## Local Network Play

The game can be played in two modes:
- Development mode: Using localhost (default)
- Local network mode: Using your local IP address

To switch between these modes, you can:
1. Use the helper functions in your code:
   ```javascript
   // To toggle between modes
   import { toggleMode } from './config';
   toggleMode();
   
   // Or to set a specific mode
   import { setMode } from './config';
   setMode('localNetwork'); // or setMode('dev')
   ```

2. The chosen mode will be saved in localStorage and persist across page reloads

For local network play, make sure you've set up your `ipConfig.js` file as described in the Setup section.

## Controls

- Arrow buttons: Move tank (Up, Down, Left, Right)
- Shoot button: Fire bullets in the direction you're facing
- Tank automatically faces the direction of movement
