import { Schema, type } from "@colyseus/schema";

export class Bullet extends Schema {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.direction = 0;
        this.ownerId = "";
    }
}

type("number")(Bullet.prototype, "x");
type("number")(Bullet.prototype, "y");
type("number")(Bullet.prototype, "direction");
type("string")(Bullet.prototype, "ownerId");