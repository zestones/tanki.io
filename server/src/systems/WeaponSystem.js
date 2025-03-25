import { Bullet } from "../schema/Bullet.js";
import MathUtils from "../utils/MathUtils.js";
import gameConfig from "../config/gameConfig.js";

export default class WeaponSystem {
    constructor(state) {
        this.state = state;
        this.lastShootTime = new Map();
        this.nextBulletId = 0;
    }

    canShoot(playerId) {
        const now = Date.now();
        const lastShoot = this.lastShootTime.get(playerId) || 0;
        return now - lastShoot >= gameConfig.SHOOT_COOLDOWN;
    }

    shoot(player, playerId) {
        if (!player || player.isDead) return false;

        if (!this.canShoot(playerId)) return false;

        this.lastShootTime.set(playerId, Date.now());

        const bullet = new Bullet();
        const radians = MathUtils.degreesToRadians(player.direction);

        // Spawn bullet at the end of the barrel
        bullet.x = player.x + Math.cos(radians) * gameConfig.BARREL_LENGTH;
        bullet.y = player.y - Math.sin(radians) * gameConfig.BARREL_LENGTH;

        bullet.direction = player.direction;
        bullet.ownerId = playerId;
        this.state.bullets.push(bullet);

        return true;
    }

    createHomingMissile(player, targetPlayerId, damage, trackingSpeed) {
        if (!player) return null;

        const missile = new Bullet();
        missile.id = `homing-${this.nextBulletId++}`;
        missile.x = player.x;
        missile.y = player.y;
        missile.velocityX = 0; // Initial velocity - will be updated in tracking logic
        missile.velocityY = 0;
        missile.damage = damage;
        missile.ownerId = player.id;
        missile.isHoming = true;
        missile.targetId = targetPlayerId;
        missile.trackingSpeed = trackingSpeed;
        missile.visualEffect = "smoke-trail";

        this.state.bullets.push(missile);
        return missile;
    }

    updateHomingMissiles() {
        this.state.bullets.forEach(bullet => {
            if (bullet.isHoming && bullet.targetId) {
                const target = this.state.players.get(bullet.targetId);

                if (!target || target.isDead) {
                    // Target is gone or dead, missile will continue straight
                    return;
                }

                // Calculate direction to target
                const dx = target.x - bullet.x;
                const dy = target.y - bullet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 5) {
                    // Too close, hit the target directly
                    bullet.x = target.x;
                    bullet.y = target.y;
                    return;
                }

                // Normalize direction
                const dirX = dx / distance;
                const dirY = dy / distance;

                // Calculate bullet speed
                const bulletSpeed = Math.sqrt(
                    bullet.velocityX * bullet.velocityX +
                    bullet.velocityY * bullet.velocityY
                ) || 5; // Default speed if stopped

                // Adjust velocity based on tracking speed
                bullet.velocityX = bullet.velocityX * (1 - bullet.trackingSpeed) +
                    dirX * bulletSpeed * bullet.trackingSpeed;
                bullet.velocityY = bullet.velocityY * (1 - bullet.trackingSpeed) +
                    dirY * bulletSpeed * bullet.trackingSpeed;
            }
        });
    }

    // Make sure to call updateHomingMissiles in the update method of this system
    update() {
        this.updateHomingMissiles();
    }
}