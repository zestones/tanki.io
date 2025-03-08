const BaseEventEmitter = require('../events/BaseEventEmitter');
const IPlayerRegistry = require('./interfaces/IPlayerRegistry');

class PlayerRegistry extends BaseEventEmitter {
    constructor() {
        super();
        this.players = new Map();
    }

    registerPlayer(connection, data) {
        const { username } = data;

        if (!username) {
            throw new Error('Username is required');
        }

        if (this.isUsernameTaken(username)) {
            throw new Error('Username already taken');
        }

        const playerData = {
            id: connection.id,
            username,
            timestamp: Date.now()
        };

        this.players.set(connection.id, playerData);
        this.emit('playerRegistered', playerData);

        return playerData;
    }

    unregisterPlayer(connectionId) {
        const player = this.players.get(connectionId);

        if (player) {
            this.players.delete(connectionId);
            this.emit('playerUnregistered', player);
            return player;
        }

        return null;
    }

    getPlayer(connectionId) {
        return this.players.get(connectionId);
    }

    getAllPlayers() {
        return Array.from(this.players.values());
    }

    isUsernameTaken(username) {
        for (const [, player] of this.players) {
            if (player.username === username) {
                return true;
            }
        }
        return false;
    }

    getPlayerCount() {
        return this.players.size;
    }
}

module.exports = PlayerRegistry;