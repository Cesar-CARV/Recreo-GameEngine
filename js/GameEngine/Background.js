import Object from "./Object.js";

export default class Background extends Object{
    constructor(game, x, y, w, h, imageURL = undefined, color = undefined){
        super(game, x, y, w, h);
        this._IMAGE = new Image();
        this._IMAGE.src = imageURL !== undefined ? imageURL : "";
        this.url = imageURL !== undefined;
        this.canDraw = imageURL === undefined ? true : false;
        this._IMAGE.onload = () => {
            this.canDraw = true;
        };
        this.color = color;
    }

    draw = (ctx) => {
        if (!this.canDraw) return;
        
        if (this.url) ctx.drawImage(this._IMAGE, this.position.x, this.position.y, this.size.x, this.size.y);
        if (this.color){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        }
    }
}