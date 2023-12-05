export default class Object {
    constructor(GAME, x, y, w, h) {
        this._GAME = GAME;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this._SPRITE = undefined;
        this._ANIMATOR = undefined;
    }

    draw = (ctx) => {
        ctx.fillStyle = "#363636";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    steps = () => {}
    
    main = (ctx) => {
        this.steps(ctx);
        if (this._SPRITE) {this._SPRITE.main(ctx);}
        if (this._ANIMATOR) {this._ANIMATOR.main(ctx);}
        this.draw(ctx);
        if (this.hitBox) this.hitBox.main(ctx);
    }
}