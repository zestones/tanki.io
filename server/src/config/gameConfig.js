export default {
    TICK_RATE: 1000 / 30, // 30 FPS

    BULLET_SPEED: 10,
    SHOOT_COOLDOWN: 600,

    RESPAWN_TIME: 3000,

    TANK_HIT_RADIUS: 20,
    BARREL_LENGTH: 30,

    MAX_PLAYERS: 50,
    PLAYER_INITIAL_HP: 100,

    // Damage calculation constants
    BASE_DAMAGE: 20,
    DAMAGE_SCALING_FACTOR: 2,
    DEFENSE_REDUCTION_PERCENT: 0.025, // 2.5% per defense point
    MIN_DEFENSE_MULTIPLIER: 0.7, // Maximum 30% reduction

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