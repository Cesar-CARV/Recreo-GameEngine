import Obj from "./object.js";

export default class UI extends Obj{
    constructor(game, x, y, w, h){
        super(game, x, y, w, h);
        this.UI = true;
        this.visible = true;
        this.hover = false;
        this.mouseOn = false;
        this.leave = false;
        this.active = false;
    }

    draw = (ctx) => {
        ctx.fillStyle = "#363636";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    checkMousePosition = (e) => {
        let mousePos = this.GAME.getMouseCords(e);

        if (mousePos.X >= this.hitBox.x && mousePos.X <= this.hitBox.x + this.hitBox.w &&
            mousePos.Y >= this.hitBox.y && mousePos.Y <= this.hitBox.y + this.hitBox.h
        ){
            this.hover = true;
            this.GAME.hoverUI = true;
            this.events(this.GAME.TYPEEVENTS.MouseHover, e);
        }
        else if (this.hover){
            this.leave = true;
            this.hover = false;
            this.events(this.GAME.TYPEEVENTS.MouseLeave, e);
            this.GAME.hoverUI = false;
        }
    }

    onMouseDown = (e) => {}
    onMouseUp = (e) => {}
    onMouseMove = (e) => {}
    onMouseHover = (e) => {}
    onMouseLeave = (e) => {}
    onKeyDown = (e) => {}
    onKeyUp = (e) => {}

    events = (type, e) => {
        if (!this.visible) return;

        if (type === this.GAME.TYPEEVENTS.MouseDown && this.mouseOn) {this.active = true; this.onMouseDown(e);}
        if (type === this.GAME.TYPEEVENTS.MouseUp && this.mouseOn) this.onMouseUp(e);
        if (type === this.GAME.TYPEEVENTS.MouseMove) {this.checkMousePosition(e); if (this.mouseOn) this.onMouseMove(e);}
        if (type === this.GAME.TYPEEVENTS.MouseHover && this.hover && !this.mouseOn) {this.onMouseHover(e); this.mouseOn = true;}
        if (type === this.GAME.TYPEEVENTS.MouseLeave && this.mouseOn) {this.onMouseLeave(e); this.mouseOn = false; this.active = false;}
        if (type === this.GAME.TYPEEVENTS.KeyDown && this.mouseOn && this.active) this.onKeyDown(e);
        if (type === this.GAME.TYPEEVENTS.KeyUp && this.mouseOn && this.active) this.onKeyUp(e);
    }

    steps = (ctx) => {
    }

    main = (ctx) => {
        if (this.visible){
            this.draw(ctx);
            this.steps(ctx);
        }
        this.hitBox.main(ctx);
    }
}