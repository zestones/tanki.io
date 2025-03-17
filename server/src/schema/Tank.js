import { Schema, type } from "@colyseus/schema";

export class Tank extends Schema {
    constructor(tankType = "ST-N01") {
        super();
        this.type = tankType; // Code name (ST-N01, GD-N02, etc.)

        this.level = 1;
        this.xp = 0;

        this.upgradePoints = 0;
    }
}

type("string")(Tank.prototype, "type");
type("number")(Tank.prototype, "defense");
type("number")(Tank.prototype, "damage");
type("number")(Tank.prototype, "speed");
type("string")(Tank.prototype, "specialty");
type("number")(Tank.prototype, "level");
type("number")(Tank.prototype, "xp");
type("number")(Tank.prototype, "upgradePoints");