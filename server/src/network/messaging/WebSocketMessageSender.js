const IMessageSender = require("../../network/interfaces/IMessageSender");

class WebSocketMessageSender extends IMessageSender {
    constructor(wss, playerRegistry) {
        super();
        this.wss = wss;
        this.playerRegistry = playerRegistry;
    }

    sendToClient(ws, data) {
        ws.send(JSON.stringify(data));
    }

    sendError(ws, message) {
        this.sendToClient(ws, {
            type: 'error',
            message
        });
    }

    broadcastToAll(data) {
        const WebSocket = require('ws');
        const message = JSON.stringify(data);
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    broadcastPlayerCount() {
        this.broadcastToAll({
            type: 'playerCount',
            count: this.playerRegistry.getPlayerCount()
        });
    }
}

module.exports = WebSocketMessageSender;