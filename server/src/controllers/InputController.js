export default class InputController {
    constructor(movementSystem, weaponSystem) {
        this.movementSystem = movementSystem;
        this.weaponSystem = weaponSystem;

        // Track player aim directions
        this.playerAimDirections = new Map();
    }

    handleDualStickInput(player, data, playerId) {
        // Handle movement
        this.movementSystem.updatePlayerPosition(
            player,
            data.movement.moving,
            data.movement.direction
        );

        // Store the aim direction separately
        this.playerAimDirections.set(playerId, data.aiming.direction);

        // Update player's visual direction based on aim direction
        player.direction = data.aiming.direction;

        // Auto-shoot if the aiming stick is active
        if (data.aiming.shooting) {
            this.weaponSystem.shoot(player, playerId);
        }
    }
}