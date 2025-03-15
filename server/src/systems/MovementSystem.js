import MathUtils from "../utils/MathUtils.js";
import gameConfig from "../config/gameConfig.js";

export default class MovementSystem {
    constructor(state) {
        this.state = state;
    }

    updatePlayerPosition(player, moving, direction) {
        if (!player || player.isDead) return;

        player.direction = direction;

        if (moving) {
            const { dx, dy } = MathUtils.calculateVelocity(direction, player.tank.speed);

            // Update position with boundary checks
            player.x = MathUtils.clamp(
                player.x + dx,
                0,
                this.state.arenaWidth
            );

            player.y = MathUtils.clamp(
                player.y - dy, // Subtract because y-axis is inverted
                0,
                this.state.arenaHeight
            );
        }
    }

    updateBullets() {
        for (let i = this.state.bullets.length - 1; i >= 0; i--) {
            const bullet = this.state.bullets[i];
            const { dx, dy } = MathUtils.calculateVelocity(bullet.direction, gameConfig.BULLET_SPEED);

            // Update bullet position
            bullet.x += dx;
            bullet.y -= dy; // Subtract because y-axis is inverted in canvas
        }
    }
}