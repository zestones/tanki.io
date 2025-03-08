class IMessageSender {
    sendToClient(client, data) { throw new Error('Method not implemented'); }
    broadcastToAll(data) { throw new Error('Method not implemented'); }
}

module.exports = IMessageSender;