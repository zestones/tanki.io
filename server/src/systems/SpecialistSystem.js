import { Specialist } from "../schema/Specialist.js";
import MathUtils from "../utils/MathUtils.js";
import gameConfig from "../config/gameConfig.js";

export default class SpecialistSystem {
    constructor(state, weaponSystem, explosionSystem, collisionSystem) {
        this.state = state;

        this.weaponSystem = weaponSystem;
        this.explosionSystem = explosionSystem;
        this.collisionSystem = collisionSystem;

        // Store original speeds for affected players
        this.originalSpeeds = new Map();
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

    deactivateSpecialist(playerId) {
        const specialist = this.getSpecialist(playerId);
        if (specialist.isActive && specialist.shouldDeactivate(Date.now())) {
            specialist.deactivate(Date.now());

            // If this was a disable effect, restore speeds of affected players
            if (specialist.effectType === Specialist.TYPE_ENUM.DISABLE) {
                this._restoreAffectedPlayerSpeeds(playerId);
            }
        }
    }

    updateSpecialists() {
        const currentTime = Date.now();
        this.state.players.forEach(player => {
            this.deactivateSpecialist(player.id);
            player.tank.specialist.update(currentTime);

            // apply effects to player
            if (player.tank.specialist.isActive) {
                if (player.tank.specialist.effectType === Specialist.TYPE_ENUM.AOE) {
                    this._applyAOEEffect(player);
                } else if (player.tank.specialist.effectType === Specialist.TYPE_ENUM.DISABLE) {
                    this._applyDisableEffect(player);
                } else if (player.tank.specialist.effectType === Specialist.TYPE_ENUM.HEAL) {
                    this._applyHealEffect(player);
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
                if (otherPlayer.id === player.id) return;

                if (!(otherPlayer.tank.specialist.effectType === Specialist.TYPE_ENUM.SHIELD && otherPlayer.tank.specialist.isActive)) {
                    // Apply damage as percentage of max health each tick
                    const damageAmount = gameConfig.PLAYER_INITIAL_HP * damagePercentPerTick;
                    otherPlayer.hp = Math.ceil(Math.max(0, otherPlayer.hp - damageAmount));
                    otherPlayer.isDead = otherPlayer.hp <= 0;

                    if (otherPlayer.isDead) {
                        this.explosionSystem.createTankExplosion(otherPlayer.x, otherPlayer.y);
                        this.collisionSystem.handlePlayerDeath(otherPlayer, player, otherPlayer.id);
                    }
                }
            }
        });
    }

    _applyDisableEffect(player) {
        const intensity = player.tank.specialist.effectIntensity;
        const speedReduction = player.tank.speed * intensity;

        this.state.players.forEach(otherPlayer => {
            const distance = MathUtils.distance(player.x, player.y, otherPlayer.x, otherPlayer.y);
            if (distance <= player.tank.specialist.effectRadius) {
                if (otherPlayer.id === player.id) return;

                // Store original speed if not already stored
                if (!this.originalSpeeds.has(`${player.id}-${otherPlayer.id}`)) {
                    this.originalSpeeds.set(`${player.id}-${otherPlayer.id}`, otherPlayer.tank.speed);
                }

                otherPlayer.tank.speed = Math.max(0, otherPlayer.tank.speed - (speedReduction * 100));
            }
        });
    }

    _applyHealEffect(player) {
        const specialist = player.tank.specialist;
        const intensity = specialist.effectIntensity;
        const duration = specialist.duration;
        const maxHP = gameConfig.PLAYER_INITIAL_HP;
        const intendedTotalHeal = intensity * maxHP;

        // Stop if total healing has reached the intended amount
        if (specialist.totalHealApplied >= intendedTotalHeal) return;

        // Calculate healing per tick based on total intended healing
        const totalTicks = duration / gameConfig.TICK_RATE;
        const healPerTick = intendedTotalHeal / totalTicks;

        // Determine heal amount, respecting max HP and remaining healing
        const healAmount = Math.min(
            Math.ceil(healPerTick),                         // Base healing per tick
            maxHP - player.hp,                              // Don't exceed max HP
            intendedTotalHeal - specialist.totalHealApplied // Don't exceed total intended healing
        );

        // Apply healing and update total
        player.hp = Math.min(maxHP, player.hp + healAmount);
        specialist.totalHealApplied += healAmount;
    }

    _restoreAffectedPlayerSpeeds(playerId) {
        this.state.players.forEach(player => {
            const key = `${playerId}-${player.id}`;
            if (this.originalSpeeds.has(key)) {
                player.tank.speed = this.originalSpeeds.get(key);
                this.originalSpeeds.delete(key);
            }
        });
    }
}