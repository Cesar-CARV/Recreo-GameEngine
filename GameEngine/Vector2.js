export default class Vector2 {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    static get Zero() { return new Vector2(0, 0); }
    /**
     * 
     * @returns {Vector2}
     */
    Magnitude() {
        return Math.sqrt(this.sqrMagnitude);
    }
    /**
     * 
     * @returns {Vector2}
     */
    SqrMagnitude() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * 
     * @returns {Vector2}
     */
    Normalized() {
        return this.Copy().Divide(this.magnitude);
    }
    /**
     * 
     * @returns {Vector2}
     */
    Copy() {
        return new Vector2(this.x, this.y);
    }
    
    /**
     * 
     * @param {Vector2} vector 
     * @returns {Vector2}
     */
    Sum(vector) {
        if (vector instanceof Vector2) {
            return new Vector2(this.x + vector.x, this.y + vector.y);
        }
        return this.Copy();
    }
    /**
     * 
     * @param {Vector2} vector 
     * @returns {Vector2}
     */
    Substract(vector) {
        if (vector instanceof Vector2) {
            return new Vector2(this.x - vector.x, this.y - vector.y);
        }
        return this.Copy();
    }
    /**
     * 
     * @param {number} num 
     * @returns {Vector2}
     */
    Multiply(num) {
        return new Vector2(this.x * num, this.y * num);
    }
    /**
     * 
     * @param {number} num 
     * @returns {Vector2}
     */
    Divide(num) {
        return new Vector2(this.x / num, this.y / num);
    }
    /**
     * 
     * @param {Vector2} vector 
     * @returns {Vector2}
     */
    DotProduct(vec) {
        return new Vector2(this.x * vec.x, this.y * vec.y);
    }
    /**
     * 
     * @param {Vector2} vector 
     * @returns {Vector2}
     */
    DotDivision(vec) {
        return new Vector2(this.x / vec.x, this.y / vec.y);
    }
    /**
     * 
     * @returns {Vector2}
     */
    InvertY() {
        return new Vector2(this.x, -this.y);
    }
     /**
     * 
     * @returns {Vector2}
     */
    InvertX() {
        return new Vector2(-this.x, this.y);
    }

    /**
     * 
     * @param {number} angleDeg 
     * @param {Vector2} origin 
     * @returns {Vector2}
     */
    Rotate(angleDeg, origin) {
        const x = this.x - origin.x;
        const y = this.y - origin.y;
        const cos = Math.cos(angleDeg / 2 / Math.PI);
        const sin = Math.sin(angleDeg / 2 / Math.PI);
        let xPrime = (x * cos) - (y * sin);
        let yPrime = (x * sin) - (y * cos);
        xPrime += origin.x;
        yPrime += origin.y;
        return new Vector2(xPrime, yPrime);
    }
}