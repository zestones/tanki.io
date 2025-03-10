import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

class Player extends Schema {
    constructor() {
        super();
        this.x = Math.random() * 800;
        this.y = Math.random() * 600;
        this.direction = 0;
        this.hp = 3;
        this.username = "";
        this.isDead = false;
        this.respawnTime = 0;
    }
}

type("number")(Player.prototype, "x");
type("number")(Player.prototype, "y");
type("number")(Player.prototype, "direction");
type("number")(Player.prototype, "hp");
type("string")(Player.prototype, "username");
type("boolean")(Player.prototype, "isDead");
type("number")(Player.prototype, "respawnTime");

class Bullet extends Schema {
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

export class GameState extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
        this.bullets = new ArraySchema();
        this.arenaWidth = 800;
        this.arenaHeight = 600;
    }
}

type("map", Player)(GameState.prototype, "players");
type("array", Bullet)(GameState.prototype, "bullets");
type("number")(GameState.prototype, "arenaWidth");
type("number")(GameState.prototype, "arenaHeight"); 