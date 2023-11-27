import TileMap from "./tileMap.js";
import Camara from "./camara.js";

export default  class Room {
    constructor(game, w, h){
        this.GAME = game;
        this.w = w;
        this.h = h;
        this.instances = [];
        this.backgrounds = [];
        this.tileMapLayer1 = undefined
        this.tileMapLayer2 = undefined
        this.tileMapLayer3 = undefined
        this.camara = new Camara(game, this);
    }

    addBackground = (bg) => {
        this.backgrounds.push(bg); 
    }

    addInstance = (inst, UI = false) => {
        if (UI){
            this.instances.push(inst);
        }
        else this.instances.unshift(inst);
    }

    removeInstance = (inst) => {
        this.instances = this.instances.filter(x => x !== inst);
    }

    draw = (ctx) => {
        this.backgrounds.forEach(bg => bg.draw(ctx));
        if (this.tileMapLayer1) this.tileMapLayer1.draw(ctx);
        if (this.tileMapLayer2) this.tileMapLayer2.draw(ctx);
        if (this.tileMapLayer3) this.tileMapLayer3.draw(ctx);
    }
}