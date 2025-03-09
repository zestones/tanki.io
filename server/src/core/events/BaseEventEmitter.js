const EventEmitter = require('events');
const IEventEmitter = require('./interfaces/IEventEmitter');

class BaseEventEmitter extends IEventEmitter {
    constructor() {
        super();
        this._eventEmitter = new EventEmitter();
    }

    on(event, listener) {
        this._eventEmitter.on(event, listener);
        return this;
    }

    emit(event, ...args) {
        this._eventEmitter.emit(event, ...args);
        return this;
    }

    removeListener(event, listener) {
        this._eventEmitter.removeListener(event, listener);
        return this;
    }
}

module.exports = BaseEventEmitter;