const { Logger } = require('../utils/Logger');

class BaseReporter {
    constructor(name) {
        this.name = name;
        this.logger = new Logger(`Reporter:${name}`);
    }

    onTestStart(config) {
        this.logger.info('Test starting');
    }

    onTestEnd(stats) {
        this.logger.info('Test ended');
    }
}

module.exports = { BaseReporter }; 