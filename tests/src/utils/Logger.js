class Logger {
    constructor(context) {
        this.context = context;
    }

    info(message) {
        this._log('INFO', message);
    }

    debug(message) {
        this._log('DEBUG', message);
    }

    error(message) {
        this._log('ERROR', message);
    }

    warn(message) {
        this._log('WARN', message);
    }

    _log(level, message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level}] [${this.context}] ${message}`);
    }
}

module.exports = { Logger }; 