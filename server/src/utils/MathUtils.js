export default class MathUtils {
    static degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

    static calculateVelocity(direction, speed) {
        const radians = this.degreesToRadians(direction);
        return {
            dx: Math.cos(radians) * speed,
            dy: Math.sin(radians) * speed
        };
    }

    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }
}