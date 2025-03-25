import MathUtils from "../utils/MathUtils.js";
import gameConfig from "../config/gameConfig.js";

export default class CollisionSystem {
    constructor(state, explosionSystem, room) {
        this.state = state;
        this.explosionSystem = explosionSystem;
        this.room = room;
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
            this.checkSingleBulletCollisions(bullet, i);
        }
    }

    checkSingleBulletCollisions(bullet, bulletIndex) {
        let hasCollided = false;

        this.state.players.forEach((player, sessionId) => {
            if (player.isDead || sessionId === bullet.ownerId || hasCollided || player.specialistInvulnerable) return;

            if (this.isColliding(player, bullet)) {
                hasCollided = true;
                this.handleBulletHit(bullet, player, bulletIndex, sessionId);
            }
        });
    }

    isColliding(player, bullet) {
        const distance = MathUtils.distance(player.x, player.y, bullet.x, bullet.y);
        return distance < gameConfig.TANK_HIT_RADIUS;
    }

    handleBulletHit(bullet, player, bulletIndex, playerSessionId) {
        // Create explosion at hit position
        this.explosionSystem.createExplosion(bullet.x, bullet.y);

        // Get the shooter player
        const shooter = this.state.players.get(bullet.ownerId);

        this.state.bullets.splice(bulletIndex, 1);

        // Use damage formula constants from gameConfig
        const baseDamage = gameConfig.BASE_DAMAGE;
        const scaledDamage = shooter.tank.damage * gameConfig.DAMAGE_SCALING_FACTOR;
        const rawDamage = baseDamage + scaledDamage;

        // Defense reduces damage by percentage in config, with minimum multiplier
        const defenseMultiplier = Math.max(
            gameConfig.MIN_DEFENSE_MULTIPLIER,
            1 - (player.tank.defense * gameConfig.DEFENSE_REDUCTION_PERCENT)
        );

        const finalDamage = Math.ceil(rawDamage * defenseMultiplier);

        // Check for shield protection
        if (!player.specialistActive && !player.specialistShieldActive) {
            player.hp -= finalDamage;
        }

        if (shooter) {
            if (player.hp <= 0) {
                this.handlePlayerDeath(player, shooter, playerSessionId);
            } else {
                shooter.score += 1; // Award points for a hit
            }
        }
    }

    handlePlayerDeath(player, shooter, playerSessionId) {
        shooter.score += 3; // Award points for a kill

        player.isDead = true;
        player.respawnTime = Date.now();

        // Create larger explosion for tank destruction
        this.explosionSystem.createTankExplosion(player.x, player.y);

        // Send countdown to the specific player
        this.room.clients.getById(playerSessionId)?.send('respawnCountdown', {
            countdown: Math.ceil(gameConfig.RESPAWN_TIME / 1000)
        });
    }
}