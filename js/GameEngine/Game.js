import Input from "./Input.js";
import Time from "./Time.js";

export default class Game {
    #oldTime = 0;
    constructor(game, canvas, input, w, h, ticks) {
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

    // modifica el tamaño del canvas en el cual se renderiza el juego
    resize = (w, h) => {
        this.canvas.width = w;
        this.canvas.height = h;

        this.input.style.width = w + 2.22 + "px";
        this.input.style.height = h + 2.22 + "px";

        this.$.style.width = w + "px";
        this.$.style.height = h + "px";

        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    };

    // #region ROOM
    getRoomNames = () => this.rooms.map((rm) => rm.name);
    getRoom = () => this.currentRoom;
    addRoom = (room) => this.rooms.push(room);
    changeRoom = (roomName, saveState = false) => {
        this.hoverUI = false;
        this.lastRoom = saveState ? this.currentRoom : undefined;
        this.currentRoom = this.rooms.filter((rm) => rm.name === roomName)[0];
    };
    // #endregion

    // #region CLIP
    // los parametros que resive esta funcion son las medidas de el area que se va a limpiar
    clipContextGraphic = (widht, height) => {
        // dibujar el fondo negro en el canvas
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.w, this.h);
        this.ctx.clip();
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.w, this.h);

        // limpiar el fondo negro donde se mostrara el contenido del nivel
        this.ctx.beginPath();
        this.ctx.rect(0, 0, widht, height);
        this.ctx.clip();

        this.ctx.clearRect(0, 0, widht, height);
    };

    // reinicia el ContextGraphic para que se muestre como normalmente lo haria
    resetContextGraphic = () => {
        // Reset current transformation matrix to the identity matrix
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    // #endregion

    // #region FINDS
    
    // ESTAS FUNCIONES QUEDAN PENDIENTES A MODIFICACION
    // RESIVIRAN DOS PARAMETROS, LA LISTA A BUSCAR Y EL SELECTOR

    // esta funcion busca un objeto por el tipo de dato, el valor queda 
    // pendiente si sera un tipo o un string ejemplo: obj instanceof UI  
    findByType = (type) => {
        return this.gameInstances.filter(inst => inst.constructor.name === type);
    }

    // esta funcion busca un objeto por un query de clave y valor, el valor queda 
    findByQuery = (type, querys = []) => {
        return this.gameInstances.filter(inst => {
            let coincidences = 0;

            querys.forEach(query => coincidences = inst[query.key] === query.value ? +1 : coincidences);

            if (coincidences === querys.length && type === inst.constructor.name) return inst;
        });
    }
    // #endregion

    // #region SETUP GAME
    // esta funcion inicia el loop principal del motor
    startGame = () => {
        this.gameLoop = setInterval(this.main, Math.floor(1000 / this.ticks));
    };

    // detiene el motor por completo
    stopGame = () => {
        clearInterval(this.gameLoop);
        this.gameLoop = undefined;
    };

    // funcion principal del motor la cual renderiza el nivel y actualiza el delta time
    main = () => {
        Time.main();
        console.log(
            `GAME RUNING ON ${this.ticks} TIKS, HOVER = ${this.hoverUI}`
        );
        if (Time.deltaTime > 10) return;
        if (this.currentRoom) this.currentRoom.main(this.ctx);
    };
    // #endregion
}
