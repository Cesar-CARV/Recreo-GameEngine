import Object from "./Object.js";

export default class Sprite extends Object {
    constructor(GAME, x, y, w, h, url) {
        super(GAME, x, y, w, h);
        this.url = url;
        this._IMAGE = new Image(w, h);
        this._IMAGE.src = url;
        this.canDraw = false;
        this._IMAGE.onload = () => {
            this.canDraw = true;
        };

        this.cutX = undefined;
        this.cutY = undefined;
        this.cutW = undefined;
        this.cutH = undefined;
    }

    draw = (ctx) => {
        if (!this.canDraw) return;

        if (
            this.cutX !== undefined &&
            this.cutY !== undefined &&
            this.cutW !== undefined &&
            this.cutH !== undefined
        ) {
            ctx.drawImage(
                this._IMAGE, // image
                this.cutX, // cut x
                this.cutY, // cut y
                this.cutW, // cut w
                this.cutH, // cut h
                this.position.x, // sprite x
                this.position.y, // sprite y
                this.size.x, // sprite w
                this.size.y // sprite h
            );
        } else {
            ctx.drawImage(
                this._IMAGE,
                this.position.x,
                this.position.y,
                this.size.x,
                this.size.y
            );
        }
    };
}