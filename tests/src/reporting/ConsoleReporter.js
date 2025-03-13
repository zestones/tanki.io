const { BaseReporter } = require('./BaseReporter');

class ConsoleReporter extends BaseReporter {
    constructor() {
        super('Console');
    }

    onTestStart(config) {
        super.onTestStart(config);
        console.log('='.repeat(50));
        console.log(`TANK GAME LOAD TEST`);
        console.log('='.repeat(50));
        console.log(`Server: ${config.serverUrl}`);
        console.log(`Players: ${config.numPlayers}`);
        console.log(`Duration: ${config.duration} seconds`);
        console.log(`Room: ${config.roomName}`);
        console.log('-'.repeat(50));
        console.log('Test started at:', new Date().toISOString());
        console.log('-'.repeat(50));
    }

    onTestEnd(stats) {
        super.onTestEnd(stats);
        console.log('-'.repeat(50));
        console.log('Test results:');
        console.log(`Test duration: ${stats.duration.toFixed(2)} seconds`);
        console.log(`Connected players: ${stats.playerCount}`);
        console.log('-'.repeat(50));
        console.log('Test ended at:', new Date().toISOString());
        console.log('='.repeat(50));
    }
}

module.exports = { ConsoleReporter }; 