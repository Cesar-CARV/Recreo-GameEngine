export default class Room {
    constructor(GAME, w, h, name) {
        this.GAME = GAME;
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

    addInstance = (inst, UI = false) => {
        if (UI) this.instancesUI.push(inst);
        else this.instances.push(inst);
    }

    removeInstance = (inst) => {
        if (UI) this.instancesUI = this.instancesUI.filter(x => x !== inst);
        else this.instances = this.instances.filter(x => x !== inst);
    }

    setCamara = (camara) => {
        this.camara = camara;
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
            this.instances.forEach(instence => {
                this.camara.render(instence);
            });
            this.camara.resetCamara();
        }
        else {
            // clip rooom
            ctx.beginPath();
            ctx.rect(0, 0, this.GAME.w, this.GAME.h);
            ctx.clip();
            
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, this.GAME.w, this.GAME.h);

            // clip room
            ctx.beginPath();
            ctx.rect(0, 0, this.w, this.h);
            ctx.clip();

            ctx.clearRect(0, 0, this.w, this.h);

            this.draw(ctx);
            this.instances.forEach(instence => {
                instence.main(ctx);
            });
        }

        // UI INSTANCES
        this.instancesUI.forEach(instenceUI => {
            instenceUI.main(ctx);
        });
    }
}