export default class InputController {
    constructor(movementSystem, weaponSystem) {
        this.movementSystem = movementSystem;
        this.weaponSystem = weaponSystem;
    }

    handleMoveInput(player, data) {
        this.movementSystem.updatePlayerPosition(
            player,
            data.moving,
            data.direction
        );
    }

    handleShootInput(player, playerId) {
        return this.weaponSystem.shoot(player, playerId);
    }
}