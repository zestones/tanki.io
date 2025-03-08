# Tanki Server

```plaintext
tanki-io-server/
├── package.json
├── .env
├── .gitignore
├── README.md
└── src/
    ├── index.js                 # Main entry point
    ├── config/
    │   ├── constants.js         # Game constants and configurations
    │   └── gameSettings.js      # Adjustable game settings
    │
    ├── core/
    │   ├── GameServer.js        # Main game server class
    │   ├── Arena.js            # Arena management
    │   └── CollisionSystem.js   # Collision detection system
    │
    ├── entities/
    │   ├── Entity.js           # Base entity class
    │   ├── Player.js           # Player entity
    │   ├── Projectile.js       # Projectile entity
    │   └── shapes/
    │       ├── Shape.js        # Base shape class
    │       ├── Triangle.js     # Triangle shape
    │       ├── Square.js       # Square shape
    │       └── Pentagon.js     # Pentagon shape
    │
    ├── game/
    │   ├── GameLoop.js         # Main game loop
    │   ├── GameState.js        # Game state management
    │   ├── LeaderboardSystem.js # Leaderboard management
    │   └── LevelSystem.js      # Level and experience system
    │
    ├── managers/
    │   ├── PlayerManager.js    # Manages player connections
    │   ├── ShapeManager.js     # Manages shapes spawning
    │   └── ProjectileManager.js # Manages projectiles
    │
    ├── network/
    │   ├── WebSocketServer.js  # WebSocket server setup
    │   ├── MessageHandler.js   # Message handling
    │   └── protocols/
    │       ├── incoming.js     # Incoming message protocols
    │       └── outgoing.js     # Outgoing message protocols
    │
    ├── systems/
    │   ├── CombatSystem.js     # Combat mechanics
    │   ├── UpgradeSystem.js    # Tank upgrades
    │   └── ScoreSystem.js      # Scoring system
    │
    ├── utils/
    │   ├── Logger.js           # Logging utility
    │   ├── Vector2D.js         # Vector calculations
    │   ├── MathUtils.js        # Math helper functions
    │   └── Validator.js        # Input validation
    │
    └── tanks/
        ├── TankBase.js         # Base tank class
        └── types/
            ├── Basic.js        # Basic tank
            ├── Twin.js         # Twin tank
            ├── Sniper.js       # Sniper tank
            └── etc...          # Other tank types
```