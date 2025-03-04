const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const players = {};

server.on('connection', (ws) => {
    console.log('New player connected');

    const playerId = Date.now(); // Simple unique ID
    players[playerId] = { x: Math.random() * 500, y: Math.random() * 500 };

    ws.send(JSON.stringify({ type: 'welcome', id: playerId, players }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'move' && players[data.id]) {
                players[data.id].x = data.x;
                players[data.id].y = data.y;
            }

            broadcast({ type: 'update', players });
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log(`Player ${playerId} disconnected`);
        delete players[playerId];
        broadcast({ type: 'update', players });
    });
});

function broadcast(data) {
    const message = JSON.stringify(data);
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

console.log('Server started on ws://localhost:8080');
