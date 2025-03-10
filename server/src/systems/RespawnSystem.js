import gameConfig from "../config/gameConfig.js";

export default class RespawnSystem {
    constructor(state) {
        this.state = state;
    }

    checkRespawns() {
        this.state.players.forEach((player) => {
            if (player.isDead && Date.now() - player.respawnTime >= gameConfig.RESPAWN_TIME) {
                player.isDead = false;
                player.hp = gameConfig.PLAYER_INITIAL_HP;

                // Respawn at a random position within the arena
                player.x = Math.random() * this.state.arenaWidth;
                player.y = Math.random() * this.state.arenaHeight;
            }
        });
    }
}