import { Schema, type } from "@colyseus/schema";

import { Tank } from "./Tank.js";

import gameConfig from "../config/gameConfig.js";

export class Player extends Schema {
    static STAT_UPGRADE_COST = 1;

    constructor(id, username, position, tankType) {
        super();

        this.id = id;
        this.x = position.x;
        this.y = position.y;

        this.direction = 0;

        this.isDead = false;
        this.respawnTime = 0;

        this.hp = gameConfig.PLAYER_INITIAL_HP;
        this.username = username;
        this.score = 0;

        this.tank = new Tank(tankType);
        this.upgradePoints = 5;
    }

    updgradeTankStat(stat) {
        if (this.upgradePoints <= 0) {
            console.log("No upgrade points left!");
            return;
        }

        this.tank.upgradeStat(stat);
        this.upgradePoints -= Player.STAT_UPGRADE_COST;
    }
}

type("number")(Player.prototype, "x");
type("number")(Player.prototype, "y");

type("number")(Player.prototype, "direction");

type("boolean")(Player.prototype, "isDead");
type("number")(Player.prototype, "respawnTime");
type("string")(Player.prototype, "username");

type("number")(Player.prototype, "hp");
type("number")(Player.prototype, "score");

type(Tank)(Player.prototype, "tank");
type("number")(Player.prototype, "upgradePoints");