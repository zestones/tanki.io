// src/utils/Logger.js
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
};

class Logger {
    constructor(context) {
        this.context = context;
        this.logLevel = process.env.LOG_LEVEL ?
            LOG_LEVELS[process.env.LOG_LEVEL] :
            LOG_LEVELS.INFO;
    }

    _formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        let formattedMessage = `[${timestamp}] [${level}] [${this.context}] ${message}`;

        if (data) {
            if (data instanceof Error) {
                formattedMessage += `\n${data.stack || data.message}`;
            } else if (typeof data === 'object') {
                try {
                    formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
                } catch (e) {
                    formattedMessage += `\n[Object unserializable]`;
                }
            } else {
                formattedMessage += `\n${data}`;
            }
        }

        return formattedMessage;
    }

    debug(message, data) {
        if (this.logLevel <= LOG_LEVELS.DEBUG) {
            console.debug(this._formatMessage('DEBUG', message, data));
        }
    }

    info(message, data) {
        if (this.logLevel <= LOG_LEVELS.INFO) {
            console.info(this._formatMessage('INFO', message, data));
        }
    }

    warn(message, data) {
        if (this.logLevel <= LOG_LEVELS.WARN) {
            console.warn(this._formatMessage('WARN', message, data));
        }
    }

    error(message, data) {
        if (this.logLevel <= LOG_LEVELS.ERROR) {
            console.error(this._formatMessage('ERROR', message, data));
        }
    }
}

module.exports = Logger;