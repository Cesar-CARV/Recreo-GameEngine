import Input from "./Input.js";
import Time from "./Time.js";

export default class Game {
    #oldTime = 0;
    constructor(game, canvas, input, w, h, ticks){
        this.$ = game;
        this.canvas = canvas;
        this.input = input;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.w = w;
        this.h = h;
        this.ticks = ticks;
        this.pauseGame = false;
        this.gameLoop = undefined;
        this.rooms = [];
        this.currentRoom = undefined;
        this.lastRoom = undefined;
        this.hoverUI = false;

        this.resize(w, h);
        Input.Init(this.input);
    }

    resize = (w, h) => {
        this.canvas.width = w;
        this.canvas.height = h;

        this.input.style.width = w + 2.22 + "px";
        this.input.style.height = h + 2.22 + "px";

        this.$.style.width = w + "px";
        this.$.style.height = h + "px";

        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }

    //#region ROOM
    getRoomNames = () => this.rooms.map(rm => rm.name);
    getRoom = () => this.currentRoom;
    addRoom = (room) => this.rooms.push(room);
    changeRoom = (roomName, saveState = false) => {
        this.hoverUI = false;
        this.lastRoom = saveState ? this.room : undefined;
        this.currentRoom = this.rooms.filter(rm => rm.name === roomName)[0];
    }
    //#endregion

    //#region SETUP GAME
    startGame = () => {
        this.gameLoop = setInterval(this.main, Math.floor(1000 / this.tiks));
    }

    stopGame = () => {
        clearInterval(this.gameLoop);
        this.gameLoop = undefined;
    }

    main = () => {
        Time.main();
        console.log(`GAME RUNING ON ${this.ticks} TIKS, HOVER = ${this.hoverUI}`);
        if (this.currentRoom) this.currentRoom.main(this.ctx);
    }
    //#endregion
}