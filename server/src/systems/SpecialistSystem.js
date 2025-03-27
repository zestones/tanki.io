import { Specialist } from "../schema/Specialist.js";
import MathUtils from "../utils/MathUtils.js";
import gameConfig from "../config/gameConfig.js";

export default class SpecialistSystem {
    constructor(state, weaponSystem, explosionSystem, collisionSystem) {
        this.state = state;

        this.weaponSystem = weaponSystem;
        this.explosionSystem = explosionSystem;
        this.collisionSystem = collisionSystem;
    }

    getSpecialist(playerId) {
        return this.state.players.get(playerId).tank.specialist;
    }

    activateSpecialist(player, playerId) {
        console.log(this.getSpecialist(playerId));
        this.getSpecialist(playerId).activate(Date.now());
        console.log(`${player.name} activated specialist`);
        console.log(this.getSpecialist(playerId).getAbilityInfo());
    }

    updateSpecialists() {
        const currentTime = Date.now();
        this.state.players.forEach(player => {
            player.tank.specialist.update(currentTime);

            // apply effects to player
            if (player.tank.specialist.isActive) {
                if (player.tank.specialist.effectType === Specialist.TYPE_ENUM.AOE) {
                    this._applyAOEEffect(player);
                }
            }
        });
    }

    _applyAOEEffect(player) {
        const intensity = player.tank.specialist.effectIntensity;
        const radius = player.tank.specialist.effectRadius;
        const duration = player.tank.specialist.duration;

        // Calculate how many ticks will occur during the ability duration
        const totalTicks = duration / gameConfig.TICK_RATE;
        const damagePercentPerTick = intensity / totalTicks;

        this.state.players.forEach(otherPlayer => {
            const distance = MathUtils.distance(player.x, player.y, otherPlayer.x, otherPlayer.y);
            if (distance <= radius) {
                // TODO: avoid self damage

                if (!(otherPlayer.tank.specialist.effectType === Specialist.TYPE_ENUM.SHIELD && otherPlayer.tank.specialist.isActive)) {
                    // Apply damage as percentage of max health each tick
                    const damageAmount = gameConfig.PLAYER_INITIAL_HP * damagePercentPerTick;
                    otherPlayer.hp = Math.ceil(Math.max(0, otherPlayer.hp - damageAmount));
                    otherPlayer.isDead = otherPlayer.hp <= 0;

                    if (otherPlayer.isDead) {
                        this.explosionSystem.createTankExplosion(otherPlayer.x, otherPlayer.y);
                        this.collisionSystem.handlePlayerDeath(player, otherPlayer);
                    }
                }
            }
        });
    }
}