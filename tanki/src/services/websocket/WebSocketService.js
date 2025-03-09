class WebSocketService {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.connectionState = 'disconnected';
        this.listeners = new Map();
        this.messageHandlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;

        // Debug flag
        this.debug = false;
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                resolve(this.socket);
                return;
            }

            this.connectionState = 'connecting';
            this._notifyStateChange();

            try {
                this.socket = new WebSocket(this.url);

                this.socket.onopen = () => {
                    this.connectionState = 'connected';
                    this.reconnectAttempts = 0;
                    this._notifyStateChange();
                    resolve(this.socket);
                };

                this.socket.onclose = (event) => {
                    this.connectionState = 'disconnected';
                    this._notifyStateChange();
                    this._handleReconnect(event);
                };

                this.socket.onerror = (error) => {
                    this.connectionState = 'error';
                    this._notifyStateChange(error);
                    reject(error instanceof Error ? error : new Error('WebSocket connection error'));
                };

                this.socket.onmessage = (event) => {
                    this._handleMessage(event);
                };
            } catch (error) {
                this.connectionState = 'error';
                this._notifyStateChange(error);
                reject(error instanceof Error ? error : new Error(error.message || 'WebSocket initialization error'));
            }
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.connectionState = 'disconnected';
            this._notifyStateChange();
        }
    }

    send(message) {
        return new Promise((resolve, reject) => {
            if (this.debug) {
                console.log('WebSocket sending message:', message);
            }

            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                if (this.debug) {
                    console.log('Socket not ready, connecting first...');
                }
                this.connect()
                    .then(() => {
                        this._sendMessage(message, resolve, reject);
                    })
                    .catch(reject);
            } else {
                this._sendMessage(message, resolve, reject);
            }
        });
    }

    _sendMessage(message, resolve, reject) {
        const checkAndSend = () => {
            if (this.socket.readyState === WebSocket.OPEN) {
                try {
                    const messageString = typeof message === 'string' ? message : JSON.stringify(message);
                    this.socket.send(messageString);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            } else if (this.socket.readyState === WebSocket.CONNECTING) {
                setTimeout(checkAndSend, 100);
            } else {
                reject(new Error('WebSocket is not in OPEN state'));
            }
        };
        checkAndSend();
    }

    addMessageHandler(messageType, handler) {
        if (!this.messageHandlers.has(messageType)) {
            this.messageHandlers.set(messageType, []);
        }
        this.messageHandlers.get(messageType).push(handler);
    }

    removeMessageHandler(messageType, handler) {
        if (this.messageHandlers.has(messageType)) {
            const handlers = this.messageHandlers.get(messageType);
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    addStateListener(listener) {
        const listenerId = Date.now().toString() + Math.random().toString(36).substring(2, 11);
        this.listeners.set(listenerId, listener);
        return listenerId;
    }

    removeStateListener(listenerId) {
        this.listeners.delete(listenerId);
    }

    _notifyStateChange(error = null) {
        this.listeners.forEach((listener) => {
            listener(this.connectionState, error);
        });
    }

    _handleMessage(event) {
        try {
            const data = JSON.parse(event.data);
            const messageType = data.type;

            if (this.debug) {
                console.log('WebSocket received message:', {
                    type: messageType,
                    data: data
                });
            }

            if (this.messageHandlers.has(messageType)) {
                if (this.debug) {
                    console.log(`Found handlers for message type: ${messageType}`);
                }
                this.messageHandlers.get(messageType).forEach((handler) => {
                    handler(data);
                });
            } else if (this.debug) {
                console.log(`No handlers found for message type: ${messageType}`);
                console.log('Available handlers:', Array.from(this.messageHandlers.keys()));
            }

            if (this.messageHandlers.has('*')) {
                this.messageHandlers.get('*').forEach((handler) => {
                    handler(data);
                });
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            console.error('Raw message:', event.data);
        }
    }

    _handleReconnect(closeEvent) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                this.connect().catch(() => { });
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    getState() {
        return this.connectionState;
    }
}

export default WebSocketService;
