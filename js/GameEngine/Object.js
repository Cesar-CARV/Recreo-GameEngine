export default class Object {
    constructor(GAME, x, y, w, h) {
        this._GAME = GAME;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this._SPRITE = undefined;
        this._ANIMATOR = undefined;
        this._BOXCOLLIDER = undefined;
        this._CHILDS = [];
    }

    draw = (ctx) => {
        ctx.fillStyle = "#363636";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    addChild = (obj, name) => { this._CHILDS.push({name: name, obj: obj});}
    getChild = (name) => {
        const child = this._CHILDS.filter(ch => ch.name === name)[0];
        return child ? child.obj : child;
    }
    delteChild = (name) => {this._CHILDS = this._CHILDS.filter(ch => ch.name !== name);}

    steps = () => {}
    
    main = (ctx) => {
        this.steps(ctx);
        this.draw(ctx);
    }
}