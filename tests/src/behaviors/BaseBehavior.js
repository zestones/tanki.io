const { Logger } = require('../utils/Logger');

class BaseBehavior {
    constructor(name) {
        this.name = name;
        this.logger = new Logger(`Behavior:${name}`);
    }

    start(player) {
        this.logger.info(`Starting behavior for player ${player.id}`);
    }

    stop(player) {
        this.logger.info(`Stopping behavior for player ${player.id}`);
        // Clear all intervals
        player.intervals.forEach(interval => clearInterval(interval));
        player.intervals = [];
    }

    sendMove(player, direction, isMoving) {
        try {
            player.room.send('move', {
                direction: direction,
                moving: isMoving
            });
        } catch (error) {
            this.logger.error(`Error sending move for player ${player.id}: ${error.message}`);
        }
    }

    sendShoot(player) {
        try {
            player.room.send('shoot');
        } catch (error) {
            this.logger.error(`Error sending shoot for player ${player.id}: ${error.message}`);
        }
    }
}

module.exports = { BaseBehavior }; 