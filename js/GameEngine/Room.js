import { SpriteAnimator } from "./Animator.js";

export default class Room {
    constructor(GAME, w, h, name) {
        this._GAME = GAME;
        this.w = w;
        this.h = h;
        this.name = name;
        this.camara;
        this.instancesUI = [];
        this.instances = [];
        this.backgrounds = [];
        this.tileMapLayer1 = undefined;
        this.tileMapLayer2 = undefined;
        this.tileMapLayer3 = undefined;
    }

    addBackground = (bg) => {
        this.backgrounds.push(bg); 
    }

    setCamara = (camara) => {
        this.camara = camara;
    }

    addInstance = (inst, UI = false) => {
        if (UI) this.instancesUI.push(inst);
        else this.instances.push(inst);
    }

    removeInstance = (inst) => {
        if (UI) this.instancesUI = this.instancesUI.filter(x => x !== inst);
        else this.instances = this.instances.filter(x => x !== inst);
    }

    draw = (ctx) => {
        this.backgrounds.forEach(bg => bg.draw(ctx));
        if (this.tileMapLayer1) this.tileMapLayer1.draw(ctx);
        if (this.tileMapLayer2) this.tileMapLayer2.draw(ctx);
        if (this.tileMapLayer3) this.tileMapLayer3.draw(ctx);
    }

    main = (ctx) => {
        if (this.camara) {
            this.camara.clearCamara();
            this.camara.steps();
            this.camara.moveCamara();
            this.draw(ctx);
            this.instances.forEach(instance => {
                this.camara.render(instance);
                if (instance._CHILDS !== new Array()) { 
                    instance._CHILDS.forEach(child => this.camara.render(child.obj));
                }
            });
            this.camara.resetCamara();
        }
        else {
            // clip rooom
            ctx.beginPath();
            ctx.rect(0, 0, this._GAME.w, this._GAME.h);
            ctx.clip();
            
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, this._GAME.w, this._GAME.h);

            // clip room
            ctx.beginPath();
            ctx.rect(0, 0, this.w, this.h);
            ctx.clip();

            ctx.clearRect(0, 0, this.w, this.h);

            this.draw(ctx);
            this.instances.forEach(instance => {
                if (!this._GAME.pauseGame) {instance.main(ctx);}
                else {instance.draw(ctx);}

                if (instance._CHILDS !== new Array()) { 
                    instance._CHILDS.forEach(child => {
                        if (!this._GAME.pauseGame) {child.obj.main(ctx);}
                        else {
                            if (child.obj.draw) child.obj.draw(ctx);
                            if (child.obj instanceof SpriteAnimator) {child.obj.main(ctx);}
                        }
                    });
                }
            });
        }

        // UI INSTANCES
        this.instancesUI.forEach(instanceUI => {
            instanceUI.main(ctx);
        });
    }
}