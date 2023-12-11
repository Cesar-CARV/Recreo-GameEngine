export default class BoxCollider {
    LAYERS = [0,1,2,3,4,5,6,7,8,9];

    constructor(GAME, target, x, y, w, h, layer, exceptions = [], show = false) {
        this._GAME = GAME;
        this.target = target;
        this.x = target.x + x;
        this.y = target.y + y;
        this.ofSetX = x;
        this.ofSetY = y;
        this.w = w;
        this.h = h;
        this.layer = layer;
        this.exceptions = exceptions;
        this.show = show;

        this.colliders = new Set();
    }

    onArea = (type = null) => {
        let colInstance = [];

        this._GAME.currentRoom.instances.forEach((instance) => {
            if (instance._BOXCOLLIDER){
                if (instance._BOXCOLLIDER !== this && !instance._BOXCOLLIDER.exceptions.includes(this.target.constructor.name)){
                   if (instance._BOXCOLLIDER.layer === this.layer){
                        if (this.x + this.w >= instance._BOXCOLLIDER.x &&
                            this.x <= instance._BOXCOLLIDER.x + instance._BOXCOLLIDER.w &&
                            this.y + this.h >= instance._BOXCOLLIDER.y &&
                            this.y <= instance._BOXCOLLIDER.y + instance._BOXCOLLIDER.h
                        ){
                            colInstance.push(instance);
                        }
                    }
                }
            }
        });

        return {on:colInstance.length > 0 , instances: colInstance};
    }

    draw = (ctx) => {
        if (this.show){
            ctx.strokeStyle = "#f00";
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }

    main = (ctx) => {
        this.x = this.target.x + this.ofSetX;
        this.y = this.target.y + this.ofSetY;
        this.draw(ctx);
    }
}