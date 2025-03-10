import { Bullet } from "../schema/Bullet.js";
import MathUtils from "../utils/MathUtils.js";
import gameConfig from "../config/gameConfig.js";

export default class WeaponSystem {
    constructor(state) {
        this.state = state;
        this.lastShootTime = new Map();
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
}