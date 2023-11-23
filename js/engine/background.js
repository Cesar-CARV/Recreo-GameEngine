import Obj from "./object.js";

export default class Background extends Obj{
    constructor(game, x, y, w, h, image = undefined, color = undefined){
        super(game, x, y, w, h);
        this.image = image;
        this.color = color;
    }

    draw = (ctx) => {
        if (this.image) ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
        if (this.color){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}