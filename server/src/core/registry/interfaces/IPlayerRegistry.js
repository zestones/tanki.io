class IPlayerRegistry {
    registerPlayer(connection, data) { throw new Error('Method not implemented'); }
    unregisterPlayer(connectionId) { throw new Error('Method not implemented'); }
    getPlayer(connectionId) { throw new Error('Method not implemented'); }
    getAllPlayers() { throw new Error('Method not implemented'); }
    isUsernameTaken(username) { throw new Error('Method not implemented'); }
}

module.exports = IPlayerRegistry;