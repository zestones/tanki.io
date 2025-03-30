import { Explosion } from "../schema/Explosion.js";
import gameConfig from "../config/gameConfig.js";

export default class ExplosionSystem {
    constructor(state) {
        this.state = state;
    }

    // TODO: Add explosion radius
    createExplosion(x, y) {
        const explosion = new Explosion(); // TODO : instantiate explosion position and radius

        explosion.x = x;
        explosion.y = y;

        this.state.explosions.push(explosion);
    }

    createTankExplosion(x, y) {
        const explosion = new Explosion();
        explosion.x = x;
        explosion.y = y;

        explosion.maxRadius = gameConfig.TANK_EXPLOSION.maxRadius;
        explosion.duration = gameConfig.TANK_EXPLOSION.duration;

        this.state.explosions.push(explosion);
    }

    updateExplosions() {
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
    }
}