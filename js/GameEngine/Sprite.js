export default class Sprite {
    constructor(x, y, w, h, url, autoDraw = true){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this._IMAGE = new Image(w, h);
        this._IMAGE.src = url;
        this.canDraw = false;
        this._IMAGE.onload = () => {
            this.canDraw = true;
        };
        this.autoDraw = autoDraw;
    }

    draw = (ctx,  offsetX = 0, offsetY = 0) => {
        if (!this.canDraw) return;

        ctx.drawImage(this._IMAGE, this.x + offsetX, this.y + offsetY, this.w, this.h);
    };

    drawAtPoint = (ctx, x, y) => {
        if (!this.canDraw) return;

        ctx.drawImage(this._IMAGE, x, y, this.w, this.h);
    }

    drawFollowTarget = (ctx, target,  offsetX = 0, offsetY = 0) => {
        if (!this.canDraw) return;

        this.x = target.x;
        this.y = target.y;
        this.draw(ctx, offsetX, offsetY);
    }

    drawCut = (ctx, cutX, cutY, cutW, cutH, offsetX, offsetY, w, h) => {
        if (!this.canDraw) return;

        ctx.drawImage(
            this._IMAGE, // image
            cutX, // cut x
            cutY, // cut y
            cutW, // cut w
            cutH, // cut h
            this.x + offsetX, // image x
            this.y + offsetY, // image y
            w, // image w
            h // image h
        );
    }

    drawCutAndFollowTarget = (ctx, target, cutX, cutY, cutW, cutH,  offsetX, offsetY, w, h) => {
        this.x = target.x;
        this.y = target.y;

        ctx.drawImage(
            this._IMAGE, // image
            cutX, // cut x
            cutY, // cut y
            cutW, // cut w
            cutH, // cut h
            this.x + offsetX, // image x
            this.y + offsetY, // image y
            w, // image w
            h // image h
        );
    }

    main = (ctx) => {if (this.autoDraw) this.draw(ctx)}
}