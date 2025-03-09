// services/game/PlayerService.js
import BaseService from '../core/BaseService';
import StorageService from '../core/StorageService';

// Singleton registry for service instances
const instances = new Map();

class PlayerService extends BaseService {
    constructor(serverUrl, storageType = 'session') {
        super(serverUrl);
        this.storageService = new StorageService(storageType);
        this.storageKey = 'tanki_username';
    }

    async register(username) {
        const requestPayload = {
            type: 'register-request',
            username: username
        };

        try {
            const response = await this.sendRequest(
                requestPayload,
                'register-response',
                5000
            );

            this.storeSession(username);
            return response;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to register player'
            };
        }
    }

    storeSession(username) {
        this.storageService.setItem(this.storageKey, username);
    }

    getSession() {
        return this.storageService.getItem(this.storageKey);
    }

    clearSession() {
        this.storageService.removeItem(this.storageKey);
    }

    // Factory method implementation
    static getInstance(serverUrl, storageType) {
        const key = `${serverUrl}-${storageType || 'session'}`;
        if (!instances.has(key)) {
            instances.set(key, new PlayerService(serverUrl, storageType));
        }
        return instances.get(key);
    }
}

export default PlayerService;