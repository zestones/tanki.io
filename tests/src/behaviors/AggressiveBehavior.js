const { BaseBehavior } = require('./BaseBehavior');

class AggressiveBehavior extends BaseBehavior {
    constructor() {
        super('AggressiveBehavior');
    }

    start(player) {
        super.start(player);

        // Initialize player's movement state
        player.movementState = {
            currentDirection: Math.floor(Math.random() * 360),
            straightLineTime: 0,
            maxStraightLineTime: 5 + Math.floor(Math.random() * 10) // 5-15 movement cycles
        };

        // Movement interval - more logical patterns
        const moveInterval = setInterval(() => {
            const state = player.movementState;

            // Increment straight line counter
            state.straightLineTime++;

            // Check if it's time to change direction
            if (state.straightLineTime >= state.maxStraightLineTime) {
                // Choose a new direction - either 90° turn or 180° turn
                const turnType = Math.random();

                if (turnType < 0.3) {
                    // 30% chance: 180° turn (go back)
                    state.currentDirection = (state.currentDirection + 180) % 360;
                } else if (turnType < 0.65) {
                    // 35% chance: 90° right turn
                    state.currentDirection = (state.currentDirection + 90) % 360;
                } else {
                    // 35% chance: 90° left turn
                    state.currentDirection = (state.currentDirection - 90 + 360) % 360;
                }

                // Reset straight line counter and set new max time
                state.straightLineTime = 0;
                state.maxStraightLineTime = 5 + Math.floor(Math.random() * 10);
            }

            // Always moving
            const isMoving = true;

            // Send move command with current direction
            this.sendMove(player, state.currentDirection, isMoving);
        }, 16); // Faster interval

        // Separate shooting interval - shoot more frequently
        const shootInterval = setInterval(() => {
            // 70% chance of shooting
            if (Math.random() < 0.7) {
                this.sendShoot(player);
            }
        }, 16);

        // Store intervals for cleanup
        player.intervals.push(moveInterval);
        player.intervals.push(shootInterval);
    }
}

module.exports = { AggressiveBehavior }; 