import { Explosion } from "../schema/Explosion.js";

export default class SpecialistSystem {
    constructor(state, weaponSystem, explosionSystem) {
        this.state = state;
        this.weaponSystem = weaponSystem;
        this.explosionSystem = explosionSystem;
    }

    getSpecialist(playerId) {
        return this.state.players.get(playerId).tank.specialist;
    }

    activateSpecialist(player, playerId) {
        console.log(this.getSpecialist(playerId));
        this.getSpecialist(playerId).activate(Date.now());
        console.log(`${player.name} activated specialist`);
    }

    updateSpecialists() {
        const currentTime = Date.now();
        this.state.players.forEach(player => {
            player.tank.specialist.update(currentTime);
        });
    }
}