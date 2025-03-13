import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

import { Player } from "./Player.js";
import { Bullet } from "./Bullet.js";
import { Explosion } from "./Explosion.js";

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