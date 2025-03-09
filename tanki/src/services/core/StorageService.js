
export class StorageService {
    constructor(storageType = 'session') {
        this.storage = storageType === 'local' ? localStorage : sessionStorage;
    }

    getItem(key, defaultValue = null) {
        try {
            const item = this.storage.getItem(key);
            return item !== null ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn(`Error getting ${key} from storage:`, e);
            return defaultValue;
        }
    }

    setItem(key, value) {
        try {
            const valueToStore = JSON.stringify(value);
            this.storage.setItem(key, valueToStore);
            return true;
        } catch (e) {
            console.error(`Error setting ${key} in storage:`, e);
            return false;
        }
    }

    removeItem(key) {
        try {
            this.storage.removeItem(key);
            return true;
        } catch (e) {
            console.error(`Error removing ${key} from storage:`, e);
            return false;
        }
    }

    clear() {
        try {
            this.storage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing storage:', e);
            return false;
        }
    }
}

export default StorageService;