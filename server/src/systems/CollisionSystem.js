import MathUtils from "../utils/MathUtils.js";
import gameConfig from "../config/gameConfig.js";

export default class CollisionSystem {
    constructor(state, explosionSystem) {
        this.state = state;
        this.explosionSystem = explosionSystem;
    }

    checkBulletBoundaryCollisions() {
        for (let i = this.state.bullets.length - 1; i >= 0; i--) {
            const bullet = this.state.bullets[i];

            // Check if bullet is out of bounds
            if (
                bullet.x < 0 ||
                bullet.x > this.state.arenaWidth ||
                bullet.y < 0 ||
                bullet.y > this.state.arenaHeight
            ) {
                // Create explosion at bullet position
                this.explosionSystem.createExplosion(bullet.x, bullet.y);

                // Remove bullet
                this.state.bullets.splice(i, 1);
            }
        }
    }

    checkBulletPlayerCollisions() {
        for (let i = this.state.bullets.length - 1; i >= 0; i--) {
            const bullet = this.state.bullets[i];
            let hasCollided = false;

            this.state.players.forEach((player, sessionId) => {
                if (player.isDead || sessionId === bullet.ownerId || hasCollided) return;

                const distance = MathUtils.distance(player.x, player.y, bullet.x, bullet.y);

                if (distance < gameConfig.TANK_HIT_RADIUS) {
                    hasCollided = true;

                    // Create explosion at hit position
                    this.explosionSystem.createExplosion(bullet.x, bullet.y);

                    // Remove bullet
                    this.state.bullets.splice(i, 1);
                    player.hp--;

                    if (player.hp <= 0) {
                        player.isDead = true;
                        player.respawnTime = Date.now();

                        // Create larger explosion for tank destruction
                        this.explosionSystem.createTankExplosion(player.x, player.y);
                    }
                }
            });
        }
    }
}