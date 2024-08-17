import Input from "./Input.js";
import Time from "./Time.js";
import Vector2 from "./Vector2.js";

export default class Game {
  #oldTime = 0;
  #gameBlur = false;
  /**
   *
   * @param {HTMLElement} game
   * @param {HTMLCanvasElement} canvas
   * @param {number} height
   * @param {number} width
   */
  constructor(game, canvas, width = undefined, height = undefined) {
    this.$ = game;
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.responsive = true;
    this.ctx = undefined;

    // * RESPONSIVE
    if (this.responsive) {
      this.viewport = new Vector2(
        width ? width : window.screen.width,
        height ? height : window.screen.height
      );
    }
    this.resize();
    this.resize();

    window.addEventListener("resize", () => {
      this.resize();
    });

    // pausar en caso de cambiar de pestaña
    document.addEventListener("visibilitychange", () => {
      console.log("AHHHHHHH");
      this.#gameBlur = !this.#gameBlur;
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
    this.smoothImage = true;

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

    if (this.responsive) {
      if (this.width || this.height) {
        this.$.style.width = this.width + "px";
        this.$.style.height = this.height + "px";
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";
      } else {
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
      }
    } else {
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";

      this.viewport = new Vector2(
        this.canvas.clientWidth,
        this.canvas.clientHeight
      );
      if (this.currentRoom) {
        this.currentRoom.sizeContextRoom = new Vector2(
          this.viewport.x,
          this.viewport.y
        );
      }
    }

    this.canvas.width = this.viewport.x;
    this.canvas.height = this.viewport.y;

    if (this.responsive) {
      this.$.style.aspectRatio = `${ratioX} / ${ratioY}`;
    }
    this.ctx = this.canvas.getContext("2d");
  };

  // #region ROOM
  /**
   *
   * @returns {Array<string>}
   */
  getRoomNames = () => this.rooms.map((rm) => rm.name);

  /**
   *
   * @returns {object}
   */
  getRoom = () => this.currentRoom;

  /**
   *
   * @param {object} room
   * @returns
   */
  addRoom = (room) => this.rooms.push(room);

  /**
   *
   * @param {string} roomName
   * @param {boolean} save
   */
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
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  scaleContextGraphic = (x, y) => {
    this.ctx.scale(x, y);
  };

  // los parametros que resive esta funcion son las medidas de el area que se va a limpiar
  /**
   *
   * @param {number} width
   * @param {number} height
   */
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

  /**
   *
   * @param {string} url
   * @returns {object}
   */
  findSound = (url) => {
    const splitedUrl = url.split("/");
    const formatUrl = `${splitedUrl[splitedUrl.length - 2]}/${
      splitedUrl[splitedUrl.length - 1]
    }`;
    return this.soundsStack.find((s) => s.src.includes(formatUrl));
  };

  /**
   *
   * @param {string} url
   * @param {number} volumen
   * @param {number} speed
   * @param {boolean} loop
   */
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

  /**
   *
   * @param {string} url
   * @returns
   */
  pauseSound = (url) => {
    const found = this.findSound(url);

    if (!found) return;
    found.pause();
  };

  /**
   *
   * @param {string} url
   * @returns
   */
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
  /**
   *
   * @param {number} timestamp
   */
  main = (timestamp) => {
    if (Time.oldTime === 0) {
      this.resize();
    }

    Time.main(timestamp);
    if (this.debug) {
      console.log(
        `%cGAME HOVER = ${this.hoverUI}, mouse:"X:${Input.mouseCord.x}, Y:${Input.mouseCord.y}", DeltaTime: ${Time.deltaTime}`,
        "color: #ffed9c; padding: 1px 4px;"
      );
    }

    this.ctx.imageSmoothingEnabled = this.smoothImage;
    this.ctx.imageSmoothingQuality = "high";

    if (this.currentRoom && !this.#gameBlur) this.currentRoom.main(this.ctx);

    if (!this.stopedGame) {
      this.gameLoop = this.requestAnimationFrame(this.main);
    } else {
      this.cancelAnimationFrame(this.gameLoop);
    }
  };
}
// #endregion
