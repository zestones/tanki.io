const { Client } = require('colyseus.js');
const { Logger } = require('../utils/Logger');

class PlayerManager {
    constructor(config) {
        this.config = config;
        this.players = [];
        this.logger = new Logger('PlayerManager');
    }

    async connectPlayers() {
        this.logger.info(`Connecting ${this.config.numPlayers} players to ${this.config.serverUrl}`);

        for (let i = 0; i < this.config.numPlayers; i++) {
            try {
                await this.connectPlayer(i);
                await new Promise(resolve => setTimeout(resolve, this.config.connectDelay));
            } catch (error) {
                this.logger.error(`Failed to connect player ${i + 1}: ${error.message}`);
            }
        }

        this.logger.info(`Connected ${this.getConnectedCount()} players`);
    }

    async connectPlayer(index) {
        const client = new Client(this.config.serverUrl);
        try {
            const room = await client.joinOrCreate(this.config.roomName, {
                username: `TestPlayer${index + 1}`
            });

            const player = {
                id: index + 1,
                client,
                room,
                connected: true,
                intervals: []
            };

            this.players.push(player);
            this.logger.debug(`Player ${index + 1} connected`);
            return player;
        } catch (error) {
            throw new Error(`Connection failed: ${error.message}`);
        }
    }

    disconnectPlayers() {
        this.logger.info('Disconnecting all players');

        this.players.forEach(player => {
            if (player.connected) {
                try {
                    // Clear any intervals
                    player.intervals.forEach(interval => clearInterval(interval));
                    player.intervals = [];

                    // Leave room
                    player.room.leave();
                    player.connected = false;
                } catch (e) {
                    this.logger.error(`Error disconnecting player ${player.id}: ${e.message}`);
                }
            }
        });

        this.logger.info('All players disconnected');
    }
    
    // Missing methods
    forEachPlayer(callback) {
        this.players.forEach(player => {
            if (player.connected) {
                callback(player);
            }
        });
    }
    
    getConnectedCount() {
        return this.players.filter(player => player.connected).length;
    }
    
    getPlayers() {
        return this.players.filter(player => player.connected);
    }
}

module.exports = { PlayerManager }; 