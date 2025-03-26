import { Room } from "@colyseus/core";
import gameConfig from "../config/gameConfig.js";
import specialistConfig from "../config/specialistConfig.js";
import { GameState } from "../schema/GameState.js";
import { Player } from "../schema/Player.js";

// Import systems
import CollisionSystem from "../systems/CollisionSystem.js";
import ExplosionSystem from "../systems/ExplosionSystem.js";
import MovementSystem from "../systems/MovementSystem.js";
import RespawnSystem from "../systems/RespawnSystem.js";
import SpecialistSystem from "../systems/SpecialistSystem.js";
import WeaponSystem from "../systems/WeaponSystem.js";

// Import controllers
import ArenaController from "../controllers/ArenaController.js";
import InputController from "../controllers/InputController.js";

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

        // Initialize specialist system after other systems
        this.specialistSystem = new SpecialistSystem(this.state, this.weaponSystem, this.explosionSystem);

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
            player.updgradeTankStat(message.stat);
        });

        // Add specialist activation message handler
        this.onMessage("activateSpecialist", (client, data = {}) => {
            const player = this.state.players.get(client.sessionId);
            if (!player) return;

            // Activate the specialist
            const success = this.specialistSystem.activateSpecialist(
                player,
                client.sessionId,
                data.targetPosition // Optional target position for abilities like orbital strike
            );

            if (success) {
                // Broadcast the specialist activation to all clients
                const tankType = player.tank.type; // Use tank.type which is the ID (ST-N01, etc.)
                const specialist = specialistConfig[tankType];

                if (!specialist) {
                    console.log(`Warning: No specialist config found for tank type: ${tankType}`);
                    return;
                }

                this.broadcast("specialistActivated", {
                    playerId: client.sessionId,
                    tankId: tankType,
                    specialistName: specialist.name,
                    effectType: specialist.effect.type,
                    position: { x: player.x, y: player.y },
                    targetPosition: data.targetPosition,
                    duration: specialist.duration
                });
            }
        });
    }

    onJoin(client, options) {
        if (options.isSpectator) return; // Don't create a player for spectators
        console.log('Player joining', options);

        const position = this.arenaController.getRandomPosition();
        const player = new Player(options.username, position, options.tankType);

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
        this.specialistSystem.updateSpecialists();
    }
}