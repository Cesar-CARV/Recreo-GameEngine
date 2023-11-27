import Game from "./game.js";
import HitBox from "./hitBox.js";
import Sprite from "./sprite.js";

export default  class Obj {
    constructor(game, x, y, w, h){
        this.GAME = game;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.isPauseable = true;
        this.hitBox = new HitBox(this, 0, 0, this.w, this.h, 1, [], false);
        this.sprite = new Sprite(this, 0, 0, w, h, '');
    }

    draw = (ctx, dX, dY) => {
        ctx.fillStyle = "#363636";
        ctx.fillRect(dX, dY, this.w, this.h);
    }

    onMouseDown = (e) => {}
    onMouseUp =  (e) => {}
    onMouseMove = (e) => {}
    onMouseHover = (e) => {}
    onMouseLeave = (e) => {}
    onKeyDown = (e) => {}
    onKeyUp = (e) => {}

    events = (type, e) => {
        if (this.GAME.hoverUI) return;
        
        if (type === this.GAME.TYPEEVENTS.MouseDown) this.onMouseDown(e);
        if (type === this.GAME.TYPEEVENTS.MouseUp) this.onMouseUp(e);
        if (type === this.GAME.TYPEEVENTS.MouseMove) this.onMouseMove(e);
        if (type === this.GAME.TYPEEVENTS.MouseHover) this.onMouseHover(e);
        if (type === this.GAME.TYPEEVENTS.MouseLeave) this.onMouseLeave(e);
        if (type === this.GAME.TYPEEVENTS.KeyDown) this.onKeyDown(e);
        if (type === this.GAME.TYPEEVENTS.KeyUp) this.onKeyUp(e);
    }
    steps = (ctx) => {}
    
    main = (ctx) => {
        this.steps(ctx);
        if (!this.GAME.room.room.camara.target) {
            this.draw(ctx, this.x, this.y);
            if (this.sprite) this.sprite.main(ctx);
        }
        else {
            this.GAME.room.room.camara.main(ctx, this);
        }
        if (this.hitBox) this.hitBox.main(ctx);
    }
}