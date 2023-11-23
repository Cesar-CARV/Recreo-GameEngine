export default  class Room {
    constructor(game, w, h){
        this.GAME = game;
        this.w = w;
        this.h = h;
        this.instances = [];
        this.backgrounds = [];
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
    }
}