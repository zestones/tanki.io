import tanksConfig from "../config/tanksConfig.js";
import { Tank } from "../schema/Tank.js";

export default class TankSystem {
    constructor() {
        this.tanksConfig = tanksConfig;
    }

    createTank(type) {
        if (!this.tanksConfig[type]) {
            // Default to SENTINEL if invalid type
            type = "ST-N01";
        }

        const tank = new Tank(type);
        const config = this.tanksConfig[type];

        // Apply base stats from config
        tank.health = config.stats.health;
        tank.damage = config.stats.damage;
        tank.speed = config.stats.speed;
        tank.specialty = config.stats.specialty;

        return tank;
    }

    upgradeTank(tank, stat) {
        // Check if player has upgrade points
        if (tank.upgradePoints <= 0) return false;

        // Apply the upgrade
        if (stat === "health" || stat === "damage" || stat === "speed") {
            tank[stat] += 1;
            tank.upgradePoints -= 1;
            return true;
        }

        return false;
    }

    calculateXpForNextLevel(level) {
        // Simple XP curve formula
        return 100 * Math.pow(1.5, level - 1);
    }

    addXp(tank, amount) {
        tank.xp += amount;
        const xpNeeded = this.calculateXpForNextLevel(tank.level);

        // Level up if enough XP
        if (tank.xp >= xpNeeded) {
            tank.xp -= xpNeeded;
            tank.level += 1;
            tank.upgradePoints += 1;
            return true; // Indicates level up occurred
        }

        return false;
    }

    getTankConfig(type) {
        return this.tanksConfig[type];
    }
}