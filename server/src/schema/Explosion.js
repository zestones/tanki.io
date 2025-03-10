import { Schema, type } from "@colyseus/schema";
import gameConfig from "../config/gameConfig.js";

export class Explosion extends Schema {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.maxRadius = gameConfig.DEFAULT_EXPLOSION.maxRadius;
        this.duration = gameConfig.DEFAULT_EXPLOSION.duration;
        this.createdAt = Date.now();
    }
}

type("number")(Explosion.prototype, "x");
type("number")(Explosion.prototype, "y");
type("number")(Explosion.prototype, "radius");
type("number")(Explosion.prototype, "maxRadius");
type("number")(Explosion.prototype, "duration");
type("number")(Explosion.prototype, "createdAt");