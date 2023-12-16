import Time from "./Time.js";

export default class BoxCollider {
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
            if (!instance._BOXCOLLIDER) return;
            if (instance._BOXCOLLIDER === this) return;
            if (instance._BOXCOLLIDER.exceptions.includes(eval(this.target.constructor))) return;
            if (instance._BOXCOLLIDER.layer !== this.layer) return;
            
            if (this.x + this.w >= instance._BOXCOLLIDER.x &&
                this.x <= instance._BOXCOLLIDER.x + instance._BOXCOLLIDER.w &&
                this.y + this.h >= instance._BOXCOLLIDER.y &&
                this.y <= instance._BOXCOLLIDER.y + instance._BOXCOLLIDER.h
            ){
                if (type === null || instance instanceof type) {colInstance.push(instance);}
            }
        });

        return {on:colInstance.length > 0 , instances: colInstance};
    }

    placeMeeting = (x, y, type = null) => {
        let colInstance = [];

        this._GAME.currentRoom.instances.forEach((instance) => {
            if (!instance._BOXCOLLIDER) return;
            if (instance._BOXCOLLIDER === this) return;
            if (instance._BOXCOLLIDER.exceptions.includes(eval(this.target.constructor))) return;
            if (instance._BOXCOLLIDER.layer !== this.layer) return;
            
            if (x >= instance._BOXCOLLIDER.x &&
                x <= instance._BOXCOLLIDER.x + instance._BOXCOLLIDER.w &&
                y >= instance._BOXCOLLIDER.y &&
                y <= instance._BOXCOLLIDER.y + instance._BOXCOLLIDER.h
            ){
                if (type === null || instance instanceof type) {colInstance.push(instance);}
            }
        });

        return {on:colInstance.length > 0 , instances: colInstance};
    }

    isOnFloor = (vel = 0, type = null) => {
        let colInstance = [];
        vel = Math.abs(vel * Time.deltaTime);

        this._GAME.currentRoom.instances.forEach((instance) => {
            if (!instance._BOXCOLLIDER) return;
            if (instance._BOXCOLLIDER === this) return;
            if (instance._BOXCOLLIDER.exceptions.includes(eval(this.target.constructor))) return;
            if (instance._BOXCOLLIDER.layer !== this.layer) return;
            
            if (this.x + this.w >= instance._BOXCOLLIDER.x &&
                this.x <= instance._BOXCOLLIDER.x + instance._BOXCOLLIDER.w &&
                this.y + this.h + vel + 1 >= instance._BOXCOLLIDER.y &&
                this.y <= instance._BOXCOLLIDER.y + instance._BOXCOLLIDER.h
            ){
                if (type === null || instance instanceof type) {colInstance.push(instance);}
            }
        });

        return {on:colInstance.length > 0 , instances: colInstance};
    }

    isOnCelling = (type = null) => {}

    isOnWall = (type = null) => {}

    draw = (ctx) => {
        if (this.show){
            ctx.strokeStyle = "#f00";
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }

    main = (ctx) => {
        this.x = this.target.x + this.ofSetX;
        this.y = this.target.y + this.ofSetY;
        ctx.fillStyle = "#f004";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        this.draw(ctx);
    }
}