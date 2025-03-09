// services/core/BaseService.js
import webSocketManager from '../websocket/WebSocketManager';
import BaseMessageHandler from '../core/BaseMessageHandler';

class BaseService {
    constructor(serverUrl) {
        this.serverUrl = serverUrl;
        this.connection = webSocketManager.getConnection(serverUrl);
        this.messageHandler = new BaseMessageHandler(this.connection);
    }

    async sendRequest(requestPayload, responseType, timeout = 5000) {
        try {
            return await this.messageHandler.createRequest(
                requestPayload,
                responseType,
                timeout
            );
        } catch (error) {
            throw new Error(`Request failed: ${error.message || 'Unknown error'}`);
        }
    }

    dispose() {
        if (this.messageHandler) {
            this.messageHandler.dispose();
        }
    }

    static getInstance(serverUrl) {
        throw new Error('getInstance must be implemented by subclasses');
    }
}

export default BaseService;