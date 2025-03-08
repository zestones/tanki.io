const BaseEventEmitter = require('../../core/events/BaseEventEmitter');
const Logger = require('../../utils/Logger');

class WebSocketServer extends BaseEventEmitter {
    constructor() {
        super();
        this.server = null;
        this.wss = null;
        this.logger = new Logger('WebSocketServer');
    }

    init(port, connectionHandler) {
        const http = require('http');
        const WebSocket = require('ws');

        this.server = http.createServer();
        this.wss = new WebSocket.Server({ server: this.server });

        this.wss.on('connection', (ws) => connectionHandler.handleConnection(ws));

        this.server.listen(port, () => {
            this.logger.info(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
            this.logger.info(`Game tick rate: ${process.env.TICK_RATE}Hz`);
            this.emit('serverStarted', { port });
        });
    }

    shutdown() {
        if (this.wss) {
            this.wss.close();
        }

        if (this.server) {
            this.server.close();
        }

        this.logger.info('WebSocket server shut down');
        this.emit('serverShutdown');
    }
}

module.exports = WebSocketServer;