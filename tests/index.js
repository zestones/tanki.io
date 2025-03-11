const { TestRunner } = require('./src/core/TestRunner');
const { RandomMovement } = require('./src/behaviors/RandomMovement');
const { AggressiveBehavior } = require('./src/behaviors/AggressiveBehavior');
const { ConsoleReporter } = require('./src/reporting/ConsoleReporter');
const minimist = require('minimist');

// Parse arguments
const args = minimist(process.argv.slice(2));

// Default configuration
const config = {
    serverUrl: args.server || 'ws://localhost:3000',
    numPlayers: args.players || 10,
    duration: args.duration || 60,
    behavior: args.behavior || 'random',
    roomName: args.room || 'game',
    connectDelay: args.delay || 100
};

// Create reporter
const reporter = new ConsoleReporter();

// Create behavior based on argument
let behavior;
if (config.behavior === 'aggressive') {
    behavior = new AggressiveBehavior();
} else {
    behavior = new RandomMovement();
}

// Initialize and run test
const testRunner = new TestRunner(config, behavior, reporter);
testRunner.run()
    .then(() => {
        console.log('Test completed successfully');
    })
    .catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
    });

// Handle termination
process.on('SIGINT', () => {
    console.log("Test interrupted, cleaning up...");
    testRunner.cleanup();
    process.exit(0);
}); 