import webSocketManager from '../websocket/WebSocketManager';

class GameService {
    constructor(serverUrl) {
        this.serverUrl = serverUrl;
        this.connection = webSocketManager.getConnection(serverUrl);
        this.username = null;
    }

    async fetchServerStats() {
        return new Promise((resolve, reject) => {
            const handleStatsResponse = (data) => {
                if (data.type === 'server-stats-response') {
                    this.connection.removeMessageHandler('server-stats-response', handleStatsResponse);
                    resolve(data.data);
                }
            };

            this.connection.addMessageHandler('server-stats-response', handleStatsResponse);

            this.connection
                .connect()
                .then(() => {
                    this.connection.send({ type: 'stats-request' });
                })
                .catch(reject);

            // Add timeout to avoid hanging forever
            setTimeout(() => {
                this.connection.removeMessageHandler('server-stats-response', handleStatsResponse);
                reject(new Error('Server stats request timed out'));
            }, 5000);
        });
    }

    async registerPlayer(username) {
        this.username = username;

        return new Promise((resolve, reject) => {
            this.connection
                .connect()
                .then(() => {
                    this.connection.send({
                        type: 'register-request',
                        username: username,
                    });

                    // TODO : wait for a register-response here
                    resolve({ success: true, username });
                })
                .catch(reject);
        });
    }

    storePlayerSession(username) {
        // TODO: create a hook useLocalStorage
        sessionStorage.setItem('diep_username', username);
    }
}

export default GameService;