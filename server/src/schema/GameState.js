import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Player extends Schema {
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

export class Explosion extends Schema {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.radius = 1;
        this.maxRadius = 20;
        this.createdAt = Date.now();
        this.duration = 300; // 300ms
    }
}

type("number")(Explosion.prototype, "x");
type("number")(Explosion.prototype, "y");
type("number")(Explosion.prototype, "radius");
type("number")(Explosion.prototype, "maxRadius");
type("number")(Explosion.prototype, "createdAt");
type("number")(Explosion.prototype, "duration");

export class GameState extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
        this.bullets = new ArraySchema();
        this.explosions = new ArraySchema();
        this.arenaWidth = 800;  // Default, will be updated based on client viewport
        this.arenaHeight = 600; // Default, will be updated based on client viewport
    }
}

type({ map: Player })(GameState.prototype, "players");
type({ array: Bullet })(GameState.prototype, "bullets");
type({ array: Explosion })(GameState.prototype, "explosions");
type("number")(GameState.prototype, "arenaWidth");
type("number")(GameState.prototype, "arenaHeight"); 