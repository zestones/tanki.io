import { Schema, type } from "@colyseus/schema";
import gameConfig from "../config/gameConfig.js";

export class Player extends Schema {
    constructor() {
        super();
        this.x = Math.random() * 800;
        this.y = Math.random() * 600;
        this.direction = 0;
        this.hp = gameConfig.PLAYER_INITIAL_HP;
        this.isDead = false;
        this.respawnTime = 0;
        this.username = "";
    }
}

type("number")(Player.prototype, "x");
type("number")(Player.prototype, "y");
type("number")(Player.prototype, "direction");
type("number")(Player.prototype, "hp");
type("boolean")(Player.prototype, "isDead");
type("number")(Player.prototype, "respawnTime");
type("string")(Player.prototype, "username");