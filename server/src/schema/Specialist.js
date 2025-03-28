import { Schema, type } from "@colyseus/schema";
import specialistData from "../config/specialistConfig.js";

export class Specialist extends Schema {
    static TYPE_ENUM = {
        SHIELD: "shield",
        AOE: "aoe",
        OBSCURE: "obscure",
        DISABLE: "disable",
        HEAL: "heal"
    };

    constructor(tankType) {
        super();

        const specialistInfo = specialistData[tankType];

        // Core specialist properties
        this.name = specialistInfo.name;
        this.cooldown = specialistInfo.cooldown;
        this.duration = specialistInfo.duration;
        this.description = specialistInfo.description;

        // Effect properties
        this.effectType = specialistInfo.effect.type;
        this.effectRadius = specialistInfo.effect.radius;
        this.effectIntensity = specialistInfo.effect.intensity;

        // Tracking and state management
        this.isActive = false;
        this.lastActivationTime = 0;
        this.remainingCooldown = 0;
    }

    activate(currentTime) {
        if (this.isReadyToActivate(currentTime)) {
            this.isActive = true;
            this.lastActivationTime = currentTime;
            return true;
        }

        return false;
    }

    isReadyToActivate(currentTime) {
        return !this.isActive &&
            (currentTime - this.lastActivationTime >= this.cooldown);
    }

    shouldDeactivate(currentTime) {
        return currentTime - this.lastActivationTime >= this.duration;
    }

    update(currentTime) {
        if (!this.isActive) {
            this.remainingCooldown = Math.max(
                0,
                this.cooldown - (currentTime - this.lastActivationTime)
            );
        }
    }

    deactivate(currentTime) {
        this.isActive = false;
        this.lastActivationTime = currentTime;
    }

    getAbilityInfo() {
        return {
            name: this.name,
            description: this.description,
            effectType: this.effectType,
            radius: this.effectRadius,
            intensity: this.effectIntensity,
            cooldown: this.cooldown,
            duration: this.duration
        };
    }
}

type("string")(Specialist.prototype, "name");

type("number")(Specialist.prototype, "cooldown");
type("number")(Specialist.prototype, "duration");

type("string")(Specialist.prototype, "description");
type("string")(Specialist.prototype, "effectType");

type("number")(Specialist.prototype, "effectRadius");
type("number")(Specialist.prototype, "effectIntensity");
type("boolean")(Specialist.prototype, "isActive");

type("number")(Specialist.prototype, "lastActivationTime");
type("number")(Specialist.prototype, "remainingCooldown");