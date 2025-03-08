// Core
const BaseEventEmitter = require('../core/events/BaseEventEmitter');

// Interfaces
const IEventEmitter = require('../core/events/interfaces/IEventEmitter');
const IConnectionHandler = require('../network/interfaces/IConnectionHandler');
const IMessageSender = require('../network/interfaces/IMessageSender');
const IPlayerRegistry = require('../core/registry/interfaces/IPlayerRegistry');

// Implementations
const PlayerRegistry = require('../core/registry/PlayerRegistry');
const WebSocketMessageHandler = require('./handlers/WebSocketMessageHandler');
const WebSocketConnectionHandler = require('./handlers/WebSocketConnectionHandler');
const WebSocketMessageSender = require('./messaging/WebSocketMessageSender');
const WebSocketServer = require('./server/WebSocketServer');
const NetworkManager = require('./NetworkManager');

module.exports = {
    // Interfaces
    IEventEmitter,
    IConnectionHandler,
    IMessageSender,
    IPlayerRegistry,

    // Base classes
    BaseEventEmitter,

    // Implementations
    PlayerRegistry,
    WebSocketMessageHandler,
    WebSocketConnectionHandler,
    WebSocketMessageSender,
    WebSocketServer,
    NetworkManager
};