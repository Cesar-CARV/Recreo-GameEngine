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
    this.gamePaused = false;
    this.gameLoop = undefined;
    this.rooms = [];
    this.currentRoom = undefined;
    this.lastRoom = undefined;
    this.hoverUI = false;
    this.debug = true;

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
  changeRoom = (roomName, save = false) => {
    this.hoverUI = false;
    // EL FUNCIONAMIENTO DE LOS NIVELES CAMBIARA
    // AHORA EL CURRENT ROOM EN LUGAR DE HACER REFERENCIA A EL NIVEL COMO TAL
    // ESTE CREARA UNA NUEVA INSTANCIA DE EL NIVEL PARA ESTO EN LUGAR DE
    // PASAR COMO PARAMETRO LA INSTANCIA DE EL ROOM A EL METODOD addRoom SE 
    // PASARA LA CLASE DE EL ROOM, ESTO QUIERE DECIR QUE PARA CREAR NIVELES
    // SE TENDRA QUE CREAR UNA NUEVA CLASE QUE HEREDE DE ROOM Y
    // QUE ESTA AÑADA LOS OBJETOS, BACKGROUND Y TILES QUE TENDRA EL MISMO EN LA VARAIBLE DE 
    // _CHILDREN
    let tempRoom = this.currentRoom;
    if (roomName === this.lastRoom?._NAME) {
      this.currentRoom = this.lastRoom;
      this.lastRoom = save ? tempRoom : undefined;
    }
    else {
      this.currentRoom = new this.rooms.filter((rm) => rm._NAME === roomName)[0];
      this.lastRoom = save ? tempRoom : undefined;
    }
    this.resetContextGraphic();
  };
  // #endregion

  scaleContextGraphic = (x, y) => {
    this.ctx.scale(x, y);
  };

  // #region CLIP

  // los parametros que resive esta funcion son las medidas de el area que se va a limpiar
  clipContextGraphic = (width, height) => {
    // dibujar el fondo negro en el canvas
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.clip();
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.w, this.h);

    // limpiar el fondo negro donde se mostrara el contenido del nivel
    const centerX = this.w / 2 - this.currentRoom.sizeContextRoom.x / 2;
    const centerY = this.h / 2 - this.currentRoom.sizeContextRoom.y / 2;

    this.ctx.beginPath();
    this.ctx.rect(centerX, centerY, width, height);
    this.ctx.clip();

    this.ctx.clearRect(centerX, centerY, width, height);
  };

  // reinicia el ContextGraphic para que se muestre como normalmente lo haria
  resetContextGraphic = () => {
    // Reset current transformation matrix to the identity matrix
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
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

  // pausa el juego
  pauseGame = () => {
    this.gamePaused = true;
  };

  // des pausa el juego
  playGame = () => {
    this.gamePaused = false;
  };

  // funcion principal del motor la cual renderiza el nivel y actualiza el delta time
  main = () => {
    Time.main();
    if (this.debug) {
      console.log(
        `%cGAME RUNING ON ${this.ticks} TIKS, HOVER = ${this.hoverUI}`,
        "color: #ffed9c; padding: 1px 4px;"
      );
    }
    if (Time.deltaTime > 10) return;
    if (this.currentRoom) this.currentRoom.main(this.ctx);
  };
  // #endregion
}
