const BaseEventEmitter = require('../../core/events/BaseEventEmitter');
const Logger = require('../../utils/Logger');

class WebSocketMessageHandler extends BaseEventEmitter {
    constructor(playerRegistry, messageSender) {
        super();

        this.playerRegistry = playerRegistry;
        this.messageSender = messageSender;

        this.logger = new Logger("WebSocketMessageHandler");
    }

    handleMessage(connection, message) {
        try {
            const data = JSON.parse(message);

            switch (data.type) {
                case "register-request":
                    this.handlePlayerRegistration(connection, data);
                    break;

                case "stats-request":
                    this.handleServerStatsRequest(connection);
                    break;

                default:
                    this.logger.warn("Unknown message type:", data.type);
                    this.emit("unknownMessageType", {
                        connection,
                        type: data.type,
                    });
            }
        } catch (error) {
            this.logger.error('Error processing message:', error);
            this.emit('messageProcessingError', { connection, error });
        }
    }

    handlePlayerRegistration(connection, data) {
        try {
            const playerData = this.playerRegistry.registerPlayer(connection, data);

            this.messageSender.sendToClient(connection, {
                type: "register-response",
                data: playerData,
            });

            this.logger.info(`Player registered: ${playerData.username}`);
            this.messageSender.broadcastPlayerCount();
        } catch (error) {
            this.logger.error("Error registering player:", error);
            this.messageSender.sendError(connection, error.message);
        }
    }

    handleServerStatsRequest(connection) {
        try {
            this.logger.info(
                "Server stats request received : ",
                this.playerRegistry.getPlayerCount()
            );

            this.messageSender.sendToClient(connection, {
                type: "server-stats-response",
                data: {
                    players: this.playerRegistry.getPlayerCount(),
                },
            });
        } catch (error) {
            this.logger.error('Error handling server stats request:', error);
            this.messageSender.sendError(
                connection,
                "Failed to get server stats :" + error.message
            );
        }
    }
}

module.exports = WebSocketMessageHandler;