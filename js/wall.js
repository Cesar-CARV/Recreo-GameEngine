import Obj from "./engine/object.js";
import HitBox from "./engine/hitBox.js";

export default class Wall extends Obj {
    constructor(game, x, y, w, h, speed = 0, flipV = false){
        super(game, x, y, w, h);
        this.speed = speed;
        this.flipV = flipV;
        this.hitBox = new HitBox(this, 0, 0, this.w, this.h, 1, [], true);
    }

    draw = (ctx) => {

        ctx.fillStyle = "#88aa33";
        ctx.fillRect(this.x + 5, this.y, this.w - 10, this.h);

        if (!this.flipV) ctx.fillRect(this.x, this.y, this.w, 30);
        else ctx.fillRect(this.x, this.y + this.h - 30, this.w, 30);
    }

    collitions = (ctx) => {
        if (this.x + this.w < 0) {
            this.x = ctx.canvas.width + this.w;
            let r = Math.floor(Math.random() * 50);
            this.y += Math.random() > 0.5 ? r * -1 : r;
        }
    }

    steps = (ctx) => {
        this.collitions(ctx);
        this.x -= this.speed;
    }
}