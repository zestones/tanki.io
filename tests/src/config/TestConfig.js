class TestConfig {
    constructor(options = {}) {
        this.serverUrl = options.serverUrl || 'ws://localhost:3000';
        this.numPlayers = options.numPlayers || 10;
        this.duration = options.duration || 60;
        this.roomName = options.roomName || 'game';
        this.connectDelay = options.connectDelay || 100;
        this.actionInterval = options.actionInterval || 500;
        this.randomFactor = options.randomFactor || 500;
    }

    validate() {
        if (this.numPlayers < 1) {
            throw new Error('Number of players must be at least 1');
        }

        if (this.duration < 1) {
            throw new Error('Test duration must be at least 1 second');
        }

        return true;
    }
}

module.exports = { TestConfig }; 