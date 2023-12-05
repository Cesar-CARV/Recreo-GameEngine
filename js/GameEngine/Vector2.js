export default class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static get Zero() { return new Vector2(0, 0); }
    Magnitude() {
        return Math.sqrt(this.sqrMagnitude);
    }
    SqrMagnitude() {
        return this.x * this.x + this.y * this.y;
    }
    Normalized() {
        return this.Copy().Divide(this.magnitude);
    }
    Copy() {
        return new Vector2(this.x, this.y);
    }
    Sum(vector) {
        if (vector instanceof Vector2) {
            return new Vector2(this.x + vector.x, this.y + vector.y);
        }
        return this.Copy();
    }
    Substract(vector) {
        if (vector instanceof Vector2) {
            return new Vector2(this.x - vector.x, this.y - vector.y);
        }
        return this.Copy();
    }
    Multiply(num) {
        return new Vector2(this.x * num, this.y * num);
    }
    Divide(num) {
        return new Vector2(this.x / num, this.y / num);
    }
    DotProduct(vec) {
        return new Vector2(this.x * vec.x, this.y * vec.y);
    }
    DotDivision(vec) {
        return new Vector2(this.x / vec.x, this.y / vec.y);
    }
    InvertY() {
        return new Vector2(this.x, -this.y);
    }
    InvertX() {
        return new Vector2(-this.x, this.y);
    }
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