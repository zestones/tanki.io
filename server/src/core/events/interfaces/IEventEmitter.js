class IEventEmitter {
    on(event, listener) { throw new Error('Method not implemented'); }
    emit(event, ...args) { throw new Error('Method not implemented'); }
    removeListener(event, listener) { throw new Error('Method not implemented'); }
}

module.exports = IEventEmitter;