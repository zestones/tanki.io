const BaseEventEmitter = require('../core/events/BaseEventEmitter');
const PlayerRegistry = require('../core/registry/PlayerRegistry');
const WebSocketServer = require('./server/WebSocketServer');
const WebSocketMessageSender = require('./messaging/WebSocketMessageSender');
const WebSocketMessageHandler = require('./handlers/WebSocketMessageHandler');
const WebSocketConnectionHandler = require('./handlers/WebSocketConnectionHandler');

class NetworkManager extends BaseEventEmitter {
    constructor() {
        super();
        this.playerRegistry = new PlayerRegistry();
        this.webSocketServer = new WebSocketServer();

        // Initialize these properties in init() when we have the wss
        this.messageSender = null;
        this.messageHandler = null;
        this.connectionHandler = null;

        this.setupEventHandlers();
    }

    init(port) {
        // Create the connection components now that we're initializing
        this.messageSender = new WebSocketMessageSender(null, this.playerRegistry);
        this.messageHandler = new WebSocketMessageHandler(this.playerRegistry, this.messageSender);
        this.connectionHandler = new WebSocketConnectionHandler(this.messageHandler);

        this.webSocketServer.init(port, this.connectionHandler);

        // Now that we have the WebSocketServer initialized, set the wss on the messageSender
        this.messageSender.wss = this.webSocketServer.wss;
    }

    setupEventHandlers() {
        // Forward relevant events from inner components
        this.playerRegistry.on('playerRegistered', (player) => {
            this.emit('playerRegistered', player);
        });

        this.playerRegistry.on('playerUnregistered', (player) => {
            this.emit('playerDisconnected', player.id);
        });

        this.connectionHandler?.on('clientDisconnected', (ws) => {
            const player = this.playerRegistry.unregisterPlayer(ws.id);
            if (player) {
                this.messageSender.broadcastPlayerCount();
            }
        });

        this.connectionHandler?.on('clientError', ({ connection, error }) => {
            this.emit('error', { clientId: connection.id, error });
        });
    }

    getConnectedPlayers() {
        return this.playerRegistry.getAllPlayers();
    }

    shutdown() {
        this.webSocketServer.shutdown();
    }
}

module.exports = NetworkManager;