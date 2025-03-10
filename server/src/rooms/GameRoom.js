import { Room } from "@colyseus/core";
import { GameState, Player, Bullet } from "../schema/GameState.js";

const BULLET_SPEED = 5;
const TANK_SPEED = 3;
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

            player.direction = data.direction;

            switch (data.direction) {
                case 0: // right
                    player.x = Math.min(player.x + TANK_SPEED, this.state.arenaWidth);
                    break;
                case 90: // up
                    player.y = Math.max(player.y - TANK_SPEED, 0);
                    break;
                case 180: // left
                    player.x = Math.max(player.x - TANK_SPEED, 0);
                    break;
                case 270: // down
                    player.y = Math.min(player.y + TANK_SPEED, this.state.arenaHeight);
                    break;
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
            bullet.x = player.x;
            bullet.y = player.y;
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
        this.state.players.set(client.sessionId, player);
    }

    onLeave(client) {
        this.state.players.delete(client.sessionId);
    }

    update(deltaTime) {
        // Update bullets
        for (let i = this.state.bullets.length - 1; i >= 0; i--) {
            const bullet = this.state.bullets[i];

            // Move bullet
            switch (bullet.direction) {
                case 0: // right
                    bullet.x += BULLET_SPEED;
                    break;
                case 90: // up
                    bullet.y -= BULLET_SPEED;
                    break;
                case 180: // left
                    bullet.x -= BULLET_SPEED;
                    break;
                case 270: // down
                    bullet.y += BULLET_SPEED;
                    break;
            }

            // Check if bullet is out of bounds
            if (
                bullet.x < 0 ||
                bullet.x > this.state.arenaWidth ||
                bullet.y < 0 ||
                bullet.y > this.state.arenaHeight
            ) {
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
                    this.state.bullets.splice(i, 1);
                    player.hp--;

                    if (player.hp <= 0) {
                        player.isDead = true;
                        player.respawnTime = Date.now();
                    }
                }
            });
        }

        // Check for respawns
        this.state.players.forEach((player) => {
            if (player.isDead && Date.now() - player.respawnTime >= RESPAWN_TIME) {
                player.isDead = false;
                player.hp = 3;
                player.x = Math.random() * this.state.arenaWidth;
                player.y = Math.random() * this.state.arenaHeight;
            }
        });
    }
} 