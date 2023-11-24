import Obj from "./object.js";

export default class Background extends Obj{
    constructor(game, x, y, w, h, imageURL = undefined, color = undefined){
        super(game, x, y, w, h);
        this.img = new Image();
        this.img.src = imageURL;
        this.color = color;
    }

    draw = (ctx) => {
        if (this.image) ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        if (this.color){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}