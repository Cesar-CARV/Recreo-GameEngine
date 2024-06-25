import Input from "./Input.js";
import Time from "./Time.js";
import Vector2 from "./Vector2.js";

export default class Game {
  #oldTime = 0;
  constructor(game, canvas, width = undefined, height = undefined) {
    this.$ = game;
    this.canvas = canvas;
    // * RESPONSIVE
    this.viewport = new Vector2(
      width ? width : window.screen.width,
      height ? height : window.screen.height
    );
    this.resize();
    this.resize();

    window.addEventListener("resize", () => {
      this.resize();
    });
    // ---------------------------------------------------

    // TODO: Crear un set llamdo sounds donde se guarden los sonidos creados para
    // TODO: evitar que se haya una llamada al servidor cada que se reprodusca
    // *soundsStack sera para saber que sonidos se estan reproduciendo y tambien sera un set
    this.soundsStack = [];
    this.gamePaused = false;
    this.stopedGame = false;
    this.gameLoop = undefined;
    this.rooms = [];
    this.currentRoom = undefined;
    this.lastRoom = undefined;
    this.hoverUI = false;
    this.debug = true;

    this.cancelAnimationFrame =
      window.cancelAnimationFrame.bind(window) ||
      window.mozCancelAnimationFrame.bind(window);

    this.requestAnimationFrame =
      window.requestAnimationFrame.bind(window) ||
      window.mozRequestAnimationFrame.bind(window) ||
      window.webkitRequestAnimationFrame.bind(window) ||
      window.msRequestAnimationFrame.bind(window);

    Input.Init(this, this.canvas);
  }

  // ajusta los cambios de aspecto segun el tamaño de el display
  resize = () => {
    const ratio = this.viewport.x / this.viewport.y;
    const ratioX = (this.viewport.x * ratio) / 100;
    const ratioY = (this.viewport.y * ratio) / 100;
    if (
      this.$.getBoundingClientRect().right / ratioX >
      this.$.getBoundingClientRect().bottom / ratioY
    ) {
      this.$.style.width = "auto";
      this.$.style.height = "100%";
    } else {
      this.$.style.width = "100%";
      this.$.style.height = "auto";
    }

    this.canvas.width = this.viewport.x;
    this.canvas.height = this.viewport.y;

    this.aspectRatio = new Vector2(ratioX, ratioY);
    this.$.style.aspectRatio = `${ratioX} / ${ratioY}`;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  };

  // #region ROOM
  getRoomNames = () => this.rooms.map((rm) => rm.name);

  getRoom = () => this.currentRoom;

  addRoom = (room) => this.rooms.push(room);

  changeRoom = (roomName, save = false) => {
    this.hoverUI = false;

    let tempRoom = this.currentRoom;
    if (roomName === this.lastRoom?._NAME) {
      this.currentRoom = this.lastRoom;
      this.lastRoom = save ? tempRoom : undefined;
    } else {
      try {
        this.currentRoom = new (this.rooms.filter(
          (rm) => rm.name === roomName
        )[0])(this);
        this.lastRoom = save ? tempRoom : undefined;
      } catch (error) {
        console.log("Was an error to change room", error);
      }
    }
    this.resetContextGraphic();
  };
  // #endregion

  // #region GRAPHICS
  // hace un scale de los graficos
  scaleContextGraphic = (x, y) => {
    this.ctx.scale(x, y);
  };

  // los parametros que resive esta funcion son las medidas de el area que se va a limpiar
  clipContextGraphic = (width, height) => {
    this.ctx.save();
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.viewport.x, this.viewport.y);

    // limpiar el fondo negro donde se mostrara el contenido del nivel
    const centerX =
      this.viewport.x / 2 - this.currentRoom.sizeContextRoom.x / 2;
    const centerY =
      this.viewport.y / 2 - this.currentRoom.sizeContextRoom.y / 2;

    // ESTA PARTE EN ESPECIAL ES LA QUE CAUSA EL CONSUMO DE CPU
    this.ctx.beginPath();
    this.ctx.rect(centerX, centerY, width, height);
    this.ctx.closePath();
    this.ctx.clip();

    this.ctx.clearRect(centerX, centerY, width, height);
  };

  // reinicia el ContextGraphic para que se muestre como normalmente lo haria
  resetContextGraphic = () => {
    this.ctx.restore();
    // Reset current transformation matrix to the identity matrix
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
  // #endregion

  // #region SOUNDS

  findSound = (url) => {
    const splitedUrl = url.split("/");
    const formatUrl = `${splitedUrl[splitedUrl.length - 2]}/${
      splitedUrl[splitedUrl.length - 1]
    }`;
    return this.soundsStack.find((s) => s.src.includes(formatUrl));
  };

  playSound = (url, volumen, speed = 1, loop = false) => {
    const found = this.findSound(url);

    if (found === undefined) {
      const temSound = new Audio(url);
      temSound.volume = volumen;
      temSound.loop = loop;
      temSound.playbackRate = speed;
      temSound.addEventListener("ended", () => this.deleteSound(temSound.src));
      temSound.play();
      this.soundsStack.push(temSound);
    } else if (found.paused) {
      found.play();
    } else {
      found.pause();
      found.currentTime = 0;
      found.play();
    }
  };

  pauseSound = (url) => {
    const found = this.findSound(url);

    if (!found) return;
    found.pause();
  };

  deleteSound = (url) => {
    const found = this.findSound(url);

    if (!found) return;
    this.soundsStack = this.soundsStack.filter((s) => s !== found);
  };

  // #endregion

  // #region SETUPGAME
  // esta funcion inicia el loop principal del motor
  startGame = () => {
    this.gameLoop =
      this.gameLoop === undefined
        ? this.requestAnimationFrame(this.main)
        : this.gameLoop;

    // this.gameLoop = setInterval(this.main, Math.floor(1000 / this.ticks));
  };

  // detiene el motor por completo
  stopGame = () => {
    this.stopedGame = true;
    this.gameLoop = undefined;
  };

  // pausa el juego
  pauseGame = () => {
    this.gamePaused = true;
    this.soundsStack.forEach((s) => s.pause());
  };

  // des pausa el juego
  playGame = () => {
    this.gamePaused = false;
    this.soundsStack.forEach((s) => s.play());
  };

  // funcion principal del motor la cual renderiza el nivel y actualiza el delta time
  main = (timestamp) => {
    Time.main(timestamp);
    if (this.debug) {
      console.log(
        `%cGAME HOVER = ${this.hoverUI}, mouse:"X:${Input.mouseCord.x}, Y:${Input.mouseCord.y}", DeltaTime: ${Time.deltaTime}`,
        "color: #ffed9c; padding: 1px 4px;"
      );
    }
    // if (Time.deltaTime > 10) return;
    if (this.currentRoom) this.currentRoom.main(this.ctx);

    if (!this.stopedGame) {
      this.gameLoop = this.requestAnimationFrame(this.main);
    } else {
      this.cancelAnimationFrame(this.gameLoop);
    }
  };
}
// #endregion
