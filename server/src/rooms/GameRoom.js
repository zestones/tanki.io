import { Room } from "@colyseus/core";
import { GameState, Player, Bullet, Explosion } from "../schema/GameState.js";

const TANK_SPEED = 3;
const BULLET_SPEED = 5 + TANK_SPEED;
const TICK_RATE = 1000 / 60; // 60 FPS
const SHOOT_COOLDOWN = 500; // 0.5 seconds
const RESPAWN_TIME = 3000; // 3 seconds

export class GameRoom extends Room {
    onCreate() {
        this.maxClients = 10; // Adjust as needed
        this.setState(new GameState());
        this.lastShootTime = new Map();

        this.setSimulationInterval((deltaTime) => this.update(deltaTime), TICK_RATE);

        this.onMessage("move", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (!player || player.isDead) return;

            // Update player's direction (in degrees)
            player.direction = data.direction;

            // Calculate velocity based on direction and speed
            if (data.moving) {
                // Convert degrees to radians
                const radians = (data.direction * Math.PI) / 180;

                // Calculate movement vector
                // This will ensure the tank moves in the direction of the joystick
                const dx = Math.cos(radians) * TANK_SPEED;
                const dy = Math.sin(radians) * TANK_SPEED;

                // Update position with boundary checks
                player.x = Math.max(0, Math.min(player.x + dx, this.state.arenaWidth));
                player.y = Math.max(0, Math.min(player.y - dy, this.state.arenaHeight));
            }
        });

        this.onMessage("shoot", (client) => {
            const player = this.state.players.get(client.sessionId);
            if (!player || player.isDead) return;

            const now = Date.now();
            const lastShoot = this.lastShootTime.get(client.sessionId) || 0;

            if (now - lastShoot < SHOOT_COOLDOWN) return;

            this.lastShootTime.set(client.sessionId, now);

            const bullet = new Bullet();

            // Calculate the position at the end of the tank's barrel
            const BARREL_LENGTH = 30; // Should match the barrel length in the client
            const radians = (player.direction * Math.PI) / 180;

            // Spawn bullet at the end of the barrel
            bullet.x = player.x + Math.cos(radians) * BARREL_LENGTH;
            bullet.y = player.y - Math.sin(radians) * BARREL_LENGTH; // Subtract because y-axis is inverted

            bullet.direction = player.direction;
            bullet.ownerId = client.sessionId;
            this.state.bullets.push(bullet);
        });
    }

    onJoin(client, options) {
        // Don't create a player for spectators
        if (options.isSpectator) {
            return;
        }

        console.log('joining', options);

        const player = new Player();
        player.username = options.username;

        // Spawn player at a random position within the arena
        player.x = Math.random() * this.state.arenaWidth;
        player.y = Math.random() * this.state.arenaHeight;

        this.state.players.set(client.sessionId, player);
    }

    onLeave(client) {
        this.state.players.delete(client.sessionId);
    }

    update(deltaTime) {
        // Update bullets
        for (let i = this.state.bullets.length - 1; i >= 0; i--) {
            const bullet = this.state.bullets[i];

            // Move bullet based on direction angle
            // Convert degrees to radians
            const radians = (bullet.direction * Math.PI) / 180;

            // Calculate movement vector using trigonometry
            const dx = Math.cos(radians) * BULLET_SPEED;
            const dy = Math.sin(radians) * BULLET_SPEED;

            // Update bullet position
            bullet.x += dx;
            bullet.y -= dy; // Subtract because y-axis is inverted in canvas

            // Check if bullet is out of bounds
            if (
                bullet.x < 0 ||
                bullet.x > this.state.arenaWidth ||
                bullet.y < 0 ||
                bullet.y > this.state.arenaHeight
            ) {
                // Create explosion at bullet position
                this.createExplosion(bullet.x, bullet.y);

                // Remove bullet
                this.state.bullets.splice(i, 1);
                continue;
            }

            // Check collisions with players
            this.state.players.forEach((player, sessionId) => {
                if (player.isDead || sessionId === bullet.ownerId) return;

                const dx = player.x - bullet.x;
                const dy = player.y - bullet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 20) { // Tank hit radius
                    // Create explosion at hit position
                    this.createExplosion(bullet.x, bullet.y);

                    // Remove bullet
                    this.state.bullets.splice(i, 1);
                    player.hp--;

                    if (player.hp <= 0) {
                        player.isDead = true;
                        player.respawnTime = Date.now();

                        // Create larger explosion for tank destruction
                        const explosion = new Explosion();
                        explosion.x = player.x;
                        explosion.y = player.y;
                        explosion.maxRadius = 40; // Larger explosion
                        explosion.duration = 500; // Longer duration
                        this.state.explosions.push(explosion);
                    }
                }
            });
        }

        // Update explosions
        for (let i = this.state.explosions.length - 1; i >= 0; i--) {
            const explosion = this.state.explosions[i];
            const elapsed = Date.now() - explosion.createdAt;

            // Update explosion radius based on time
            const progress = Math.min(1, elapsed / explosion.duration);
            explosion.radius = explosion.maxRadius * progress;

            // Remove explosion when it's done
            if (elapsed >= explosion.duration) {
                this.state.explosions.splice(i, 1);
            }
        }

        // Check for respawns
        this.state.players.forEach((player) => {
            if (player.isDead && Date.now() - player.respawnTime >= RESPAWN_TIME) {
                player.isDead = false;
                player.hp = 3;
                // Respawn at a random position within the arena
                player.x = Math.random() * this.state.arenaWidth;
                player.y = Math.random() * this.state.arenaHeight;
            }
        });
    }

    // Helper method to create explosions
    createExplosion(x, y) {
        const explosion = new Explosion();
        explosion.x = x;
        explosion.y = y;
        this.state.explosions.push(explosion);
    }
} 