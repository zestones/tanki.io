export default class ArenaController {
    constructor(state) {
        this.state = state;
    }

    updateArenaSize(width, height) {
        if (this.isValidDimension(width) && this.isValidDimension(height)) {
            this.state.arenaWidth = width;
            this.state.arenaHeight = height;
            return true;
        }
        return false;
    }

    isValidDimension(value) {
        return typeof value === 'number' && value > 0;
    }

    getRandomPosition() {
        return {
            x: Math.random() * this.state.arenaWidth,
            y: Math.random() * this.state.arenaHeight
        };
    }
}