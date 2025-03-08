// src/utils/Vector2D.js

class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Add another vector to this one
     * @param {Vector2D} vector - The vector to add
     * @returns {Vector2D} - A new vector with the result
     */
    add(vector) {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    /**
     * Subtract another vector from this one
     * @param {Vector2D} vector - The vector to subtract
     * @returns {Vector2D} - A new vector with the result
     */
    subtract(vector) {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    /**
     * Multiply this vector by a scalar
     * @param {number} scalar - The scalar to multiply by
     * @returns {Vector2D} - A new vector with the result
     */
    multiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    /**
     * Divide this vector by a scalar
     * @param {number} scalar - The scalar to divide by
     * @returns {Vector2D} - A new vector with the result
     */
    divide(scalar) {
        if (scalar === 0) {
            throw new Error('Cannot divide by zero');
        }
        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    /**
     * Get the magnitude (length) of this vector
     * @returns {number} - The magnitude
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Get the squared magnitude of this vector
     * @returns {number} - The squared magnitude
     */
    magnitudeSquared() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Get the normalized version of this vector (unit vector)
     * @returns {Vector2D} - A new vector that is normalized
     */
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            return new Vector2D(0, 0);
        }
        return this.divide(mag);
    }

    /**
     * Calculate the dot product with another vector
     * @param {Vector2D} vector - The other vector
     * @returns {number} - The dot product
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * Calculate the distance to another vector
     * @param {Vector2D} vector - The other vector
     * @returns {number} - The distance
     */
    distanceTo(vector) {
        return this.subtract(vector).magnitude();
    }

    /**
     * Calculate the squared distance to another vector
     * @param {Vector2D} vector - The other vector
     * @returns {number} - The squared distance
     */
    distanceToSquared(vector) {
        return this.subtract(vector).magnitudeSquared();
    }

    /**
     * Limit the magnitude of this vector
     * @param {number} max - The maximum magnitude
     * @returns {Vector2D} - A new vector with limited magnitude
     */
    limit(max) {
        if (this.magnitudeSquared() > max * max) {
            return this.normalize().multiply(max);
        }
        return new Vector2D(this.x, this.y);
    }

    /**
     * Get the angle of this vector in radians
     * @returns {number} - The angle in radians
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Rotate this vector by an angle
     * @param {number} angle - The angle in radians
     * @returns {Vector2D} - A new rotated vector
     */
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2D(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    /**
     * Convert to a plain object
     * @returns {Object} - Plain object with x and y
     */
    toObject() {
        return { x: this.x, y: this.y };
    }

    /**
     * Create a vector from an angle and magnitude
     * @param {number} angle - The angle in radians
     * @param {number} magnitude - The magnitude
     * @returns {Vector2D} - A new vector
     */
    static fromAngle(angle, magnitude = 1) {
        return new Vector2D(
            magnitude * Math.cos(angle),
            magnitude * Math.sin(angle)
        );
    }

    /**
     * Create a vector from an object with x and y properties
     * @param {Object} obj - The object with x and y
     * @returns {Vector2D} - A new vector
     */
    static fromObject(obj) {
        return new Vector2D(obj.x, obj.y);
    }
}

module.exports = Vector2D;