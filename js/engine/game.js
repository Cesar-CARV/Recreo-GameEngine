import Display from "./diplay.js";

export default class Game {
    constructor(canvas, input , w, h, tiks){
        this.display = new Display(canvas, input, w, h);
        this.tiks = tiks;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.tiks = tiks;
        this.$ = document.querySelector("#game");
        this.gameInstances = [];
        this.pauseGame = false;
        this.gameLoop = undefined;
        this.rooms = [];
        this.room = undefined;
        this.lastRoom = undefined;
        this.hoverUI = false;
        this.TYPEEVENTS = {
            MouseDown: "md",
            MouseUp: "mu", 
            MouseMove: "mm", 
            MouseHover: "mh",
            MouseLeave: "ml",
            KeyDown: "kd",
            KeyUp: "ku"
        }

        this.gameEvents();
        
        this.$.style.width = w + "px";
        this.$.style.height = h + "px";
    }

    isCollition = (obj) => {
        let colInstance = [];
        
        this.gameInstances.forEach((instance) => {            
            if (instance !== obj && !instance.hitBox.exceptions.includes(obj.constructor)){
                if (instance.hitBox.layer === obj.hitBox.layer){
                    if (obj.hitBox.x + obj.hitBox.w >= instance.hitBox.x &&
                        obj.hitBox.x <= instance.hitBox.x + instance.hitBox.w &&
                        obj.hitBox.y + obj.hitBox.h >= instance.hitBox.y &&
                        obj.hitBox.y <= instance.hitBox.y + instance.hitBox.h
                    ){
                        if (!instance.UI) colInstance.push(instance);
                    }
                }
            }
        });

        return [colInstance.length > 0 , colInstance];
    }

    isFreeUp = (obj, velV = 0) => {
        let colInstance = [];
        
        this.gameInstances.forEach((instance) => {
            if (instance.UI) return;

            if (instance !== obj && !instance.hitBox.exceptions.includes(obj.constructor)){
                if (instance.hitBox.layer === obj.hitBox.layer){
                    if (obj.hitBox.y - 1 - Math.abs(velV) > instance.hitBox.y &&
                        obj.hitBox.y - 1 - Math.abs(velV) < instance.hitBox.y + instance.hitBox.h && 
                        obj.hitBox.x + obj.hitBox.w >= instance.hitBox.x &&
                        obj.hitBox.x <= instance.hitBox.x + instance.hitBox.w
                    ) {
                            if (!instance.UI) colInstance.push(instance);
                            return;
                    }
                }
            }
        });

        return [!colInstance.length > 0 , colInstance];
    }

    isFreeDown = (obj, velV = 0) => {
        let colInstance = [];
        
        this.gameInstances.forEach((instance) => {
            if (instance.UI) return;

            if (instance !== obj && !instance.hitBox.exceptions.includes(obj.constructor)){
                if (instance.hitBox.layer === obj.hitBox.layer){
                    if (obj.hitBox.y + obj.hitBox.h + 1 + Math.abs(velV) >= instance.hitBox.y &&
                        obj.hitBox.y + obj.hitBox.h + 1 + Math.abs(velV) <= instance.hitBox.y + instance.hitBox.h &&
                        obj.hitBox.x + obj.hitBox.w >= instance.hitBox.x &&
                        obj.hitBox.x <= instance.hitBox.x + instance.hitBox.w
                    ) {
                            if (!instance.UI) colInstance.push(instance);
                            return;
                    }
                }
            }
        });

        return [!colInstance.length > 0 , colInstance];
    }

    isFreeLeft = (obj, velH = 0) => {
        let colInstance = [];
        
        this.gameInstances.forEach((instance) => {
            if (instance.UI) return;

            if (instance !== obj && !instance.hitBox.exceptions.includes(obj.constructor)){
                if (instance.hitBox.layer === obj.hitBox.layer){
                    if (obj.hitBox.x - 1 - Math.abs(velH) > instance.hitBox.x &&
                        obj.hitBox.x - 1 - Math.abs(velH) < instance.hitBox.x + instance.hitBox.w &&
                        obj.hitBox.y + obj.hitBox.h >= instance.hitBox.y &&
                        obj.hitBox.y <= instance.hitBox.y + instance.hitBox.h
                    ) {
                            if (!instance.UI) colInstance.push(instance);
                            return;
                    }
                }
            }
        });

        return [!colInstance.length > 0 , colInstance];
    }

    isFreeRigth = (obj, velH = 0) => {
        let colInstance = [];
        
        this.gameInstances.forEach((instance) => {
            if (instance.UI) return;

            if (instance !== obj && !instance.hitBox.exceptions.includes(obj.constructor)){
                if (instance.hitBox.layer === obj.hitBox.layer){
                    if (obj.hitBox.x + obj.hitBox.w + 1 + Math.abs(velH) > instance.hitBox.x &&
                        obj.hitBox.x + obj.hitBox.w + 1 + Math.abs(velH) < instance.hitBox.x + instance.hitBox.w &&
                        obj.hitBox.y + obj.hitBox.h >= instance.hitBox.y &&
                        obj.hitBox.y <= instance.hitBox.y + instance.hitBox.h
                    ) {
                            if (!instance.UI) colInstance.push(instance);
                            return;
                    }
                }
            }
        });

        return [!colInstance.length > 0 , colInstance];
    }

    getMouseCords = (e) => {
        return {X: e.offsetX - e.target.style.left, Y: e.offsetY - e.target.style.top};
    }

    findByType = (type) => {
        return this.gameInstances.filter(inst => inst.constructor.name === type);
    }

    findByQuery = (type, querys = []) => {
        return this.gameInstances.filter(inst => {
            let coincidences = 0;

            querys.forEach(query => coincidences = inst[query.key] === query.value ? +1 : coincidences);

            if (coincidences === querys.length && type === inst.constructor.name) return inst;
        });
    }

    getRoomNames = () => {
        return this.rooms.map(rm => rm.name);
    }

    addRoom = (name, room) => {
        this.rooms.push({name:name, room:room});
    }

    renderRoom = () => {
        this.gameInstances = this.room.room.instances;
    }
    
    changeRoom = (roomName, saveState = false) => {
        this.hoverUI = false;
        this.lastRoom = saveState ? this.room : undefined;
        this.room = this.rooms.filter(rm => rm.name === roomName)[0];
        this.renderRoom();
    }

    startGame = () => {
        this.gameLoop = setInterval(this.main, Math.floor(1000 / this.tiks));
    }

    endGame = () => {
        clearInterval(this.gameLoop);
        this.gameLoop = undefined;
    }

    emitEvents = (type, e) => {
        this.gameInstances.forEach(instance => {
            if (instance.isPauseable === true){
                if (this.pauseGame === false) instance.events(type, e);
            }
            else {
                instance.events(type, e);
            }
        });
    }

    gameEvents = () => {
        this.display.INPUT.addEventListener('contextmenu', e => {
            e.preventDefault();
        });
        this.display.INPUT.addEventListener('mousedown', e => {
            this.emitEvents(this.TYPEEVENTS.MouseDown, e);
        });
        this.display.INPUT.addEventListener('mouseup', e => {
            this.emitEvents(this.TYPEEVENTS.MouseUp, e);
        });
        this.display.INPUT.addEventListener('mousemove', e => {
            this.emitEvents(this.TYPEEVENTS.MouseMove, e);
        });

        this.display.INPUT.addEventListener("keydown", e => {
            this.emitEvents(this.TYPEEVENTS.KeyDown, e);
        });
        this.display.INPUT.addEventListener('keyup', e => {
            this.emitEvents(this.TYPEEVENTS.KeyUp, e);
        });
    }

    main = () => {
        console.warn(`runing game, ${this.tiks} tiks, pause: ${this.pauseGame}, UI = ${this.hoverUI}`)

        if (!this.pauseGame) {
            this.ctx.clearRect(0, 0, this.display.w, this.display.h);
        }

        if (this.room) this.room.room.draw(this.ctx);
        
        this.gameInstances.forEach(instance => {
            if (instance.isPauseable === true){
                if (this.pauseGame === false) instance.main(this.ctx);
                else instance.draw(this.ctx);
            }
            else {
                if (instance.UI) instance.main(this.ctx);
                else instance.main(this.ctx);
            }
        });
    }

}
