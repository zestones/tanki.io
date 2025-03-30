import { Schema, type } from "@colyseus/schema";

import tanksData from "../config/tanksConfig.js";
import { Specialist } from "./Specialist.js";



export class Tank extends Schema {
    static MAX_STAT = 10;
    static VALID_STATS = ['damage', 'defense', 'speed'];

    constructor(tankType = "ST-N01") {
        super();

        this.type = tankType;
        const tankInfo = tanksData[this.type] || tanksData["ST-N01"];

        this.specialty = tankInfo.stats.specialty;

        this.defense = tankInfo.stats.defense;
        this.damage = tankInfo.stats.damage;
        this.speed = tankInfo.stats.speed;

        this.specialist = new Specialist(this.type);
    }

    upgradeStat(stat) {
        if (!Tank.VALID_STATS.includes(stat)) {
            console.log(`Invalid stat upgrade attempt: ${stat}`);
            return;
        }

        if (this[stat] >= Tank.MAX_STAT) {
            console.log(`Stat already at max: ${stat}`);
            return;
        }

        this[stat]++;
    }
}

type("string")(Tank.prototype, "type");

type("number")(Tank.prototype, "defense");
type("number")(Tank.prototype, "damage");
type("number")(Tank.prototype, "speed");

type("string")(Tank.prototype, "specialty");

type(Specialist)(Tank.prototype, "specialist");
