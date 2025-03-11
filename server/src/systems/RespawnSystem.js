import gameConfig from "../config/gameConfig.js";

export default class RespawnSystem {
    constructor(state, room) {
        this.state = state;
        this.room = room;
    }

    checkRespawns() {
        this.state.players.forEach((player, sessionId) => {
            if (player.isDead) {
                const elapsedTime = Date.now() - player.respawnTime;
                const remainingTime = Math.ceil((gameConfig.RESPAWN_TIME - elapsedTime) / 1000);

                // Send countdown updates to the specific player
                if (remainingTime > 0) {
                    this.room.clients.getById(sessionId)?.send('respawnCountdown', {
                        countdown: remainingTime
                    });
                }

                // Check if it's time to respawn
                if (elapsedTime >= gameConfig.RESPAWN_TIME) {
                    player.isDead = false;
                    player.hp = gameConfig.PLAYER_INITIAL_HP;

                    // Respawn at a random position within the arena
                    player.x = Math.random() * this.state.arenaWidth;
                    player.y = Math.random() * this.state.arenaHeight;

                    // Notify the specific player of respawn
                    this.room.clients.getById(sessionId)?.send('playerRespawned');
                }
            }
        });
    }
}