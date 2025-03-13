const { BaseBehavior } = require('./BaseBehavior');

class RandomMovement extends BaseBehavior {
    constructor() {
        super('RandomMovement');
    }

    start(player) {
        super.start(player);

        // Create an interval for random movements
        const interval = setInterval(() => {
            // Generate random direction (0-360 degrees)
            const direction = Math.floor(Math.random() * 360);

            // 70% chance of moving
            const isMoving = Math.random() > 0.3;

            // Send move command
            this.sendMove(player, direction, isMoving);

            // 30% chance of shooting
            if (Math.random() < 0.3) {
                this.sendShoot(player);
            }
        }, 500 + Math.random() * 500); // Random interval

        // Store interval for cleanup
        player.intervals.push(interval);
    }
}

module.exports = { RandomMovement }; 