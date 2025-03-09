require('dotenv').config(); // Load environment variables
const NetworkManager = require('./network/NetworkManager');
const Logger = require('./utils/Logger');

// Create logger instance for the main server
const logger = new Logger('GameServer');

// Default values if not provided in environment
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const TICK_RATE = process.env.TICK_RATE || 60;

// Set environment variables if not already set
if (!process.env.NODE_ENV) process.env.NODE_ENV = NODE_ENV;
if (!process.env.TICK_RATE) process.env.TICK_RATE = TICK_RATE;

class GameServer {
    constructor() {
        this.networkManager = new NetworkManager();
        this.setupEventHandlers();
        this.isRunning = false;
        this.lastTick = Date.now();
        this.tickInterval = null;
    }

    setupEventHandlers() {
        // Handle player events
        this.networkManager.on('playerRegistered', (player) => {
            logger.info(`Player registered and ready: ${player.username} (${player.id})`);
            // Additional game logic for new players can go here
        });

        this.networkManager.on('playerDisconnected', (playerId) => {
            logger.info(`Player fully disconnected: ${playerId}`);
            // Additional cleanup logic can go here
        });

        // Handle errors
        this.networkManager.on('error', ({ clientId, error }) => {
            logger.error(`Error from client ${clientId}:`, error);
        });

        // Setup process event handlers for graceful shutdown
        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught exception:', error);
            this.shutdown();
        });
    }

    start(port = PORT) {
        if (this.isRunning) {
            logger.warn('Server is already running');
            return;
        }

        // Initialize network components
        this.networkManager.init(port);

        // Start the game loop
        this.isRunning = true;
        this.startGameLoop();

        logger.info(`Game server started on port ${port}`);
    }

    startGameLoop() {
        const targetTickInterval = 1000 / process.env.TICK_RATE;

        this.tickInterval = setInterval(() => {
            const now = Date.now();
            const deltaTime = now - this.lastTick;
            this.lastTick = now;

            this.update(deltaTime / 1000); // Convert to seconds for game logic
        }, targetTickInterval);

        logger.info(`Game loop started with tick rate: ${process.env.TICK_RATE}Hz`);
    }

    update(deltaTime) {
        // This is where game update logic would go
        // For example:
        // - Update game state
        // - Process game logic
        // - Broadcast game state to players
    }

    shutdown() {
        if (!this.isRunning) {
            return;
        }

        logger.info('Shutting down server...');

        // Stop the game loop
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }

        // Shutdown network components
        this.networkManager.shutdown();

        this.isRunning = false;
        logger.info('Server shutdown complete');

        // Give a short delay to allow logs to flush
        setTimeout(() => {
            process.exit(0);
        }, 100);
    }
}

// Create and start the server
const gameServer = new GameServer();
gameServer.start();

// Export the server instance for testing purposes
module.exports = gameServer;