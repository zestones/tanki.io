class IConnectionHandler {
    handleConnection(connection) { throw new Error('Method not implemented'); }
    handleDisconnection(connection) { throw new Error('Method not implemented'); }
    handleError(connection, error) { throw new Error('Method not implemented'); }
    handleMessage(connection, message) { throw new Error('Method not implemented'); }
}

module.exports = IConnectionHandler;