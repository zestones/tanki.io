const { PlayerManager } = require('./PlayerManager');
const { TestConfig } = require('../config/TestConfig');

class TestRunner {
    constructor(config, behavior, reporter) {
        this.config = new TestConfig(config);
        this.behavior = behavior;
        this.reporter = reporter;
        this.playerManager = new PlayerManager(this.config);
        this.isRunning = false;
        this.startTime = null;
        this.endTime = null;
        this.testTimeout = null;
    }

    async run() {
        // Validate configuration
        this.config.validate();

        // Report test start
        this.reporter.onTestStart(this.config);
        this.startTime = Date.now();
        this.isRunning = true;

        // Connect players
        await this.playerManager.connectPlayers();

        // Start behaviors
        this.playerManager.forEachPlayer(player => {
            this.behavior.start(player);
        });

        // Schedule test end
        this.testTimeout = setTimeout(() => {
            this.cleanup();
        }, this.config.duration * 1000);

        // Return promise that resolves when test completes
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
    }

    cleanup() {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.endTime = Date.now();
        clearTimeout(this.testTimeout);

        // Stop behaviors
        this.playerManager.forEachPlayer(player => {
            this.behavior.stop(player);
        });

        // Disconnect players
        this.playerManager.disconnectPlayers();

        // Report test end
        this.reporter.onTestEnd({
            duration: (this.endTime - this.startTime) / 1000,
            playerCount: this.playerManager.getConnectedCount()
        });

        // Resolve the run promise
        if (this.resolvePromise) {
            this.resolvePromise();
        }
    }
}

module.exports = { TestRunner }; 