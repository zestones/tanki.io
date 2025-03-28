import { Room } from "@colyseus/core";
import { GameState } from "../schema/GameState.js";
import { Player } from "../schema/Player.js";
import gameConfig from "../config/gameConfig.js";

// Import systems
import MovementSystem from "../systems/MovementSystem.js";
import CollisionSystem from "../systems/CollisionSystem.js";
import WeaponSystem from "../systems/WeaponSystem.js";
import RespawnSystem from "../systems/RespawnSystem.js";
import ExplosionSystem from "../systems/ExplosionSystem.js";
import TankSystem from "../systems/TankSystem.js";

// Import controllers
import InputController from "../controllers/InputController.js";
import ArenaController from "../controllers/ArenaController.js";

export class GameRoom extends Room {
    onCreate() {
        this.maxClients = gameConfig.MAX_PLAYERS;
        this.setState(new GameState());

        // Initialize systems
        this.explosionSystem = new ExplosionSystem(this.state);
        this.movementSystem = new MovementSystem(this.state);
        this.collisionSystem = new CollisionSystem(this.state, this.explosionSystem, this);
        this.weaponSystem = new WeaponSystem(this.state);
        this.respawnSystem = new RespawnSystem(this.state, this);
        this.tankSystem = new TankSystem();

        // Initialize controllers
        this.inputController = new InputController(this.movementSystem, this.weaponSystem);
        this.arenaController = new ArenaController(this.state);

        // Set up the game loop
        this.setSimulationInterval((deltaTime) => this.update(deltaTime), gameConfig.TICK_RATE);

        // Set up message handlers
        this.setupMessageHandlers();
    }

    setupMessageHandlers() {
        this.onMessage("updateArenaSize", (client, data) => {
            if (this.arenaController.updateArenaSize(data.width, data.height)) {
                console.log(`Arena size updated to ${data.width}x${data.height}`);
            }
        });

        this.onMessage("dualStickInput", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                this.inputController.handleDualStickInput(player, data, client.sessionId);
            }
        });

        // TODO : Legacy shoot handler (keeped for backward compatibility with tests)
        this.onMessage("shoot", (client) => {
            const player = this.state.players.get(client.sessionId);
            this.inputController.handleShootInput(player, client.sessionId);
        });

        this.onMessage("upgradeTank", (client, message) => {
            const player = this.state.players.get(client.sessionId);
            if (!player) return;

            const upgraded = this.tankSystem.upgradeTank(player.tank, message.stat);

            // Optional: send confirmation to client
            if (upgraded) {
                client.send("upgradeSuccess", { stat: message.stat, newValue: player.tank[message.stat] });
            }
        });
    }

    onJoin(client, options) {
        // Don't create a player for spectators
        if (options.isSpectator) return;

        console.log('Player joining', options);

        const player = new Player();
        player.username = options.username || `Player ${client.sessionId.substr(0, 4)}`;

        // Set tank type if specified
        if (options.tankType && this.tankSystem.getTankConfig(options.tankType)) {
            player.tank = this.tankSystem.createTank(options.tankType);
        }

        // Spawn player at a random position
        const position = this.arenaController.getRandomPosition();
        player.x = position.x;
        player.y = position.y;

        this.state.players.set(client.sessionId, player);
    }

    onLeave(client) {
        this.state.players.delete(client.sessionId);
    }

    update(deltaTime) {
        // Update all game systems in the correct order
        this.movementSystem.updateBullets();
        this.collisionSystem.checkBulletBoundaryCollisions();
        this.collisionSystem.checkBulletPlayerCollisions();
        this.explosionSystem.updateExplosions();
        this.respawnSystem.checkRespawns();
    }
}