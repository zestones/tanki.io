export default {
    TANK_SPEED: 2,
    BULLET_SPEED: 8, // 5 + TANK_SPEED from original
    TICK_RATE: 1000 / 30, // 30 FPS
    SHOOT_COOLDOWN: 500, // 0.5 seconds
    RESPAWN_TIME: 3000, // 3 seconds
    TANK_HIT_RADIUS: 20,
    BARREL_LENGTH: 30,
    MAX_PLAYERS: 50,
    PLAYER_INITIAL_HP: 3,

    // Explosion config
    DEFAULT_EXPLOSION: {
        maxRadius: 20,
        duration: 300
    },
    TANK_EXPLOSION: {
        maxRadius: 40,
        duration: 500
    }
};