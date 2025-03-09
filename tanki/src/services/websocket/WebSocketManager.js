import WebSocketService from './WebSocketService';

class WebSocketManager {
    constructor() {
        this.connections = new Map();
    }

    getConnection(url) {
        if (!this.connections.has(url)) {
            this.connections.set(url, new WebSocketService(url));
        }
        return this.connections.get(url);
    }

    removeConnection(url) {
        if (this.connections.has(url)) {
            const connection = this.connections.get(url);
            connection.disconnect();
            this.connections.delete(url);
        }
    }
}

// Singleton instance
const webSocketManager = new WebSocketManager();
export default webSocketManager;