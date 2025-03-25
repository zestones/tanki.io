import { Room } from "@colyseus/core";
import { GameState } from "../schema/GameState.js";
import { Player } from "../schema/Player.js";
import gameConfig from "../config/gameConfig.js";
import specialistConfig from "../config/specialistConfig.js";

// Import systems
import MovementSystem from "../systems/MovementSystem.js";
import CollisionSystem from "../systems/CollisionSystem.js";
import WeaponSystem from "../systems/WeaponSystem.js";
import RespawnSystem from "../systems/RespawnSystem.js";
import ExplosionSystem from "../systems/ExplosionSystem.js";
import TankSystem from "../systems/TankSystem.js";
import SpecialistSystem from "../systems/SpecialistSystem.js";

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
            if (!player || player.upgradePoints <= 0) return;

            const validStats = ['damage', 'defense', 'speed'];

            if (!validStats.includes(message.stat)) {
                console.log(`Invalid stat upgrade attempt: ${message.stat}`);
                return;
            }

            // Check if stat is already at max
            if (player.tank[message.stat] >= 10) {
                console.log(`Stat already at max: ${message.stat}`);
                return;
            }

            // Upgrade the stat
            player.tank[message.stat]++;
            player.upgradePoints--;
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

        // Add target selection message for specialists that need targeting
        this.onMessage("selectSpecialistTarget", (client, data) => {
            // This is useful for abilities like Orbital Strike that need a target location
            const player = this.state.players.get(client.sessionId);
            if (!player || !player.specialistActive) return;

            // Store the target position in the specialist system
            const activeEffect = this.specialistSystem.activeEffects.get(client.sessionId);
            if (activeEffect && activeEffect.type === "aoe") {
                activeEffect.data.targetPosition = data.position;
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
        this.specialistSystem.updateSpecialists();
    }
}