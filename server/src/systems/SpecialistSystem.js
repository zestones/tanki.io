import specialistConfig from "../config/specialistConfig.js";
import { Explosion } from "../schema/Explosion.js";

export default class SpecialistSystem {
    constructor(state, weaponSystem, explosionSystem) {
        this.state = state;
        this.weaponSystem = weaponSystem;
        this.explosionSystem = explosionSystem;
        this.activeEffects = new Map(); // Track active effects by player ID
    }

    activateSpecialist(player, sessionId, targetPosition = null) {
        if (!player || !player.tank || !player.tank.type) return false;

        const tankId = player.tank.type;
        const specialist = specialistConfig[tankId];

        if (!specialist) {
            console.log(`No specialist found for tank: ${tankId}`);
            return false;
        }

        // Check if specialist is on cooldown or already active
        const currentTime = Date.now();
        if (player.specialistActive) {
            console.log(`Specialist already active for player ${player.username}`);
            return false;
        }

        if (player.specialistCooldown > currentTime) {
            console.log(`Specialist on cooldown for player ${player.username}`);
            return false;
        }

        // Set specialist state
        player.specialistActive = true;
        player.specialistActiveUntil = currentTime + specialist.duration;
        player.specialistCooldown = currentTime + specialist.cooldown;

        // Initialize the effect data in the map BEFORE executing any specialist methods
        this.activeEffects.set(sessionId, {
            type: specialist.effect.type,
            startTime: currentTime,
            endTime: player.specialistActiveUntil,
            data: {} // Initialize empty data object
        });

        // Execute specialist effect based on type
        switch (specialist.effect.type) {
            case "dash":
                this.activateDash(player, sessionId, specialist.effect);
                break;
            case "shield":
                this.activateShield(player, sessionId, specialist.effect);
                break;
            case "homing":
                this.activateHomingMissiles(player, sessionId, specialist.effect);
                break;
            case "decoy":
                this.activateDecoys(player, sessionId, specialist.effect);
                break;
            case "aoe":
                this.activateOrbitalStrike(player, sessionId, specialist.effect, targetPosition);
                break;
            default:
                console.log(`Unknown specialist effect type: ${specialist.effect.type}`);
                return false;
        }

        console.log(`Player ${player.username} activated specialist: ${specialist.name}`);
        return true;
    }

    activateDash(player, sessionId, effect) {
        // Store the original speed to restore later - we know the data object exists now
        const activeEffect = this.activeEffects.get(sessionId);
        activeEffect.data.originalSpeed = player.tank.moveSpeed;

        // Apply speed boost 
        player.tank.moveSpeed *= effect.speedBoost;

        // Apply invulnerability if specified
        if (effect.invulnerable) {
            player.specialistInvulnerable = true;
        }
    }

    activateShield(player, sessionId, effect) {
        // Just mark as active, damage reduction will be handled in collision system
        player.specialistShieldActive = true;
    }

    activateHomingMissiles(player, sessionId, effect) {
        // Launch specified number of homing missiles
        const targets = this.findNearestTargets(player, effect.missileCount);
        const effectData = { missiles: [] };

        targets.forEach(target => {
            const missile = this.weaponSystem.createHomingMissile(
                player,
                target.id,
                effect.damage,
                effect.trackingSpeed
            );

            if (missile) {
                effectData.missiles.push(missile.id);
            }
        });

        // Update the data in the activeEffects map
        const activeEffect = this.activeEffects.get(sessionId);
        activeEffect.data = effectData;
    }

    activateDecoys(player, sessionId, effect) {
        // Implementation would involve creating decoy entities in the game state
        // This is a placeholder for the decoy logic
        const decoys = [];

        for (let i = 0; i < effect.decoyCount; i++) {
            // Create a decoy at a position near the player
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;

            const decoy = {
                id: `decoy-${sessionId}-${i}`,
                x: player.x + offsetX,
                y: player.y + offsetY,
                health: effect.decoyHealth,
                behavior: effect.decoyBehavior,
                appearanceId: player.tank.type
            };

            decoys.push(decoy);
        }

        this.activeEffects.get(sessionId).data = { decoys };
    }

    activateOrbitalStrike(player, sessionId, effect, targetPosition) {
        // If no target specified, use player's current position
        const target = targetPosition || { x: player.x, y: player.y };

        // Create an explosion at target position
        const explosion = new Explosion();
        explosion.x = target.x;
        explosion.y = target.y;
        explosion.radius = effect.radius;
        explosion.damage = effect.damage;
        explosion.ownerId = sessionId;
        explosion.duration = 1000; // Duration of explosion effect
        explosion.visualEffect = effect.visualEffect;

        this.state.explosions.push(explosion);

        // Find all players in radius and apply damage
        this.state.players.forEach((otherPlayer, otherPlayerId) => {
            if (otherPlayerId !== sessionId && !otherPlayer.isDead) {
                const dx = otherPlayer.x - target.x;
                const dy = otherPlayer.y - target.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= effect.radius) {
                    // Apply damage with falloff based on distance from center
                    const damageMultiplier = 1 - (distance / effect.radius);
                    const damage = Math.round(effect.damage * damageMultiplier);
                    otherPlayer.hp -= damage;

                    // Check if player died from the strike
                    if (otherPlayer.hp <= 0) {
                        otherPlayer.isDead = true;
                        otherPlayer.respawnTime = Date.now() + 3000; // 3 seconds respawn delay
                        player.score += 1; // Award score to the striker
                    }
                }
            }
        });
    }

    findNearestTargets(player, count) {
        const targets = [];
        const playerId = Array.from(this.state.players.entries())
            .find(([id, p]) => p === player)?.[0];

        if (!playerId) return targets;

        // Find all players except self
        const otherPlayers = Array.from(this.state.players.entries())
            .filter(([id, p]) => id !== playerId && !p.isDead)
            .map(([id, p]) => {
                // Calculate distance
                const dx = p.x - player.x;
                const dy = p.y - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                return { id, player: p, distance };
            })
            .sort((a, b) => a.distance - b.distance);

        // Return closest players up to the count requested
        return otherPlayers.slice(0, count);
    }

    deactivateSpecialist(player, sessionId) {
        if (!player || !player.specialistActive) return;

        const activeEffect = this.activeEffects.get(sessionId);
        if (!activeEffect) return;

        // Clean up based on effect type
        switch (activeEffect.type) {
            case "dash":
                // Restore original speed
                if (activeEffect.data.originalSpeed) {
                    player.tank.moveSpeed = activeEffect.data.originalSpeed;
                }
                player.specialistInvulnerable = false;
                break;

            case "shield":
                player.specialistShieldActive = false;
                break;

            // Other effect types cleanup as needed
        }

        player.specialistActive = false;
        this.activeEffects.delete(sessionId);
    }

    updateSpecialists() {
        const currentTime = Date.now();

        this.state.players.forEach((player, sessionId) => {
            // Skip if specialist is not active
            if (!player.specialistActive) return;

            // Check if specialist duration has ended
            if (player.specialistActiveUntil <= currentTime) {
                this.deactivateSpecialist(player, sessionId);
                console.log(`Specialist deactivated for player ${player.username}`);
            }
        });
    }
}
