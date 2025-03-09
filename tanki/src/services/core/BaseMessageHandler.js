class BaseMessageHandler {
    constructor(connection) {
        this.connection = connection;
        this.activeHandlers = new Map();
    }

    createRequest(requestPayload, responseType, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const requestId = Date.now().toString() + Math.random().toString(36).substring(2, 7);

            // Add unique ID to request for tracking
            const payload = {
                ...requestPayload,
                requestId
            };

            // Setup handlers with unique request ID
            const successHandler = (response) => {
                // Only resolve if this handler hasn't been cleaned up
                if (this.activeHandlers.has(requestId)) {
                    this.cleanupHandlers(requestId);
                    resolve(response.data || response);
                }
            };

            const errorHandler = (response) => {
                if (!response.requestId || response.requestId === requestId) {
                    this.cleanupHandlers(requestId);
                    reject(new Error(response.message || 'Request failed'));
                }
            };

            // Store handlers for later cleanup
            this.activeHandlers.set(requestId, {
                responseType,
                successHandler,
                errorHandler,
                timeoutId: setTimeout(() => {
                    // Only reject if this handler hasn't been cleaned up
                    if (this.activeHandlers.has(requestId)) {
                        this.cleanupHandlers(requestId);
                        reject(new Error(`Request timed out: ${responseType}`));
                    }
                }, timeout)
            });

            // Register handlers
            this.connection.addMessageHandler(responseType, (response) => {
                // Check if the response matches our request
                if (response.requestId === requestId) {
                    successHandler(response);
                }
            });

            this.connection.addMessageHandler('error', errorHandler);

            // Send request
            this.connection.connect()
                .then(() => this.connection.send(payload))
                .catch(error => {
                    this.cleanupHandlers(requestId);
                    reject(error instanceof Error ? error : new Error(error?.message || String(error)));
                });
        });
    }

    cleanupHandlers(requestId) {
        const handlers = this.activeHandlers.get(requestId);
        if (handlers) {
            clearTimeout(handlers.timeoutId);
            this.connection.removeMessageHandler(handlers.responseType, handlers.successHandler);
            this.connection.removeMessageHandler('error', handlers.errorHandler);
            this.activeHandlers.delete(requestId);
        }
    }

    dispose() {
        this.activeHandlers.forEach((handlers, requestId) => {
            this.cleanupHandlers(requestId);
        });
    }
}

export default BaseMessageHandler;