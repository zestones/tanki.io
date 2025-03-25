import { Schema, type } from "@colyseus/schema";
import { Tank } from "./Tank.js";

import gameConfig from "../config/gameConfig.js";

export class Player extends Schema {
    constructor() {
        super();
        this.x = Math.random() * 800;
        this.y = Math.random() * 600;
        this.direction = 0;

        this.isDead = false;
        this.respawnTime = 0;

        this.hp = gameConfig.PLAYER_INITIAL_HP;
        this.username = "";
        this.score = 0;

        this.tank = new Tank();
        this.upgradePoints = 5;
    }
}

type("number")(Player.prototype, "x");
type("number")(Player.prototype, "y");
type("number")(Player.prototype, "direction");
type("number")(Player.prototype, "hp");
type("boolean")(Player.prototype, "isDead");
type("number")(Player.prototype, "respawnTime");
type("string")(Player.prototype, "username");
type("number")(Player.prototype, "score");
type(Tank)(Player.prototype, "tank");
type("number")(Player.prototype, "upgradePoints");