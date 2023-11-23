export default class HitBox{

    LAYERS = [1,2,3,4,5,6,7,8,9];

    constructor(parent, x, y, w, h, layer, exceptions = [], show = false){
        this.parent = parent;
        this.x = parent.x + x;
        this.y = parent.y + y;
        this.ofSetX = x;
        this.ofSetY = y;
        this.w = w;
        this.h = h;
        this.layer = layer;
        this.exceptions = exceptions;
        this.show = show;
    }

    draw = (ctx) => {
        if (this.show){
            ctx.strokeStyle = "#f00";
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }

    main = (ctx) => {
        this.draw(ctx);
        this.x = this.parent.x + this.ofSetX;
        this.y = this.parent.y + this.ofSetY;
    }
}