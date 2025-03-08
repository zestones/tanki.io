const BaseEventEmitter = require('../../core/events/BaseEventEmitter');
const IConnectionHandler = require('../../network/interfaces/IConnectionHandler');
const Logger = require('../../utils/Logger');

class WebSocketConnectionHandler extends BaseEventEmitter {
    constructor(messageHandler) {
        super();
        this.messageHandler = messageHandler;
        this.logger = new Logger("WebSocketConnectionHandler");
    }

    handleConnection(ws) {
        this.logger.info("New Client connected");
        ws.id = Date.now();

        ws.on('message', (message) => this.messageHandler.handleMessage(ws, message));
        ws.on('close', () => this.handleDisconnection(ws));
        ws.on('error', (error) => this.handleError(ws, error));

        this.emit('clientConnected', ws);
    }

    handleDisconnection(ws) {
        this.logger.info("Client disconnected");
        this.emit('clientDisconnected', ws);
    }

    handleError(ws, error) {
        this.logger.error('WebSocket error:', error);
        this.emit('clientError', { connection: ws, error });
    }
}

module.exports = WebSocketConnectionHandler;