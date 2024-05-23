import Object from "./Object.js";
import Clock from "./Clock.js";

export default class Sprite extends Object {
  constructor(GAME, x, y, w, h, url) {
    super(GAME, x, y, w, h);
    this.url = url;
    this._IMAGE = new Image(w, h);
    this._IMAGE.src = url;
    this.canDraw = false;
    this._IMAGE.onload = () => {
      this.canDraw = true;
    };

    // flip
    this.flipX = false;
    this.flipY = false;

    // coordenadas y medidas de el recorte que se realizara a la imagen
    this.cutX = undefined;
    this.cutY = undefined;
    this.cutW = undefined;
    this.cutH = undefined;
    this.tileWidth = undefined;
    this.tileHeight = undefined;

    // animation properties
    this.animation = [];
    this.frame = 0;
    this.frames = -1;
    this.time = 0;
    this.repeat = true;

    this.clock = new Clock(GAME, this.time, this.repeat);
  }

  onEnd = (callback) => {
    if (callback) callback();
  }

  draw = (ctx) => {
    if (!this.canDraw) return;

    const FX = this.flipX ? -1 : 1;
    const FY = this.flipY ? -1 : 1;

    ctx.save();
    ctx.scale(FX, FY);

    // comprueba si no hay las coordenadas y medidas del recorte estan completas
    // de ser asi se dibujar la imagen recortada, si no se dibujara completa.
    if (
      this.cutX !== undefined &&
      this.cutY !== undefined &&
      this.cutW !== undefined &&
      this.cutH !== undefined &&
      this.tileWidth !== undefined &&
      this.tileHeight !== undefined
    ) {
      ctx.drawImage(
        this._IMAGE, // image
        this.cutX, // cut x
        this.cutY, // cut y
        this.cutW, // cut w
        this.cutH, // cut h
        (this.position.x + (FX === -1 ? this.tileWidth : 0)) * FX,
        (this.position.y + (FY === -1 ? this.tileHeight : 0)) * FY,
        this.tileWidth, // sprite w
        this.tileHeight // sprite h
      );
    } else {
      ctx.drawImage(
        this._IMAGE,
        (this.position.x + (FX === -1 ? this.size.x : 0)) * FX,
        (this.position.y + (FY === -1 ? this.size.y : 0)) * FY,
        this.size.x,
        this.size.y
      );
    }

    ctx.restore();
  };

  play = () => {
    if (!this.clock) return;
    this.clock.start();
  };

  stop = () => {
    if (!this.clock) return;
    this.clock.pause();
  };

  cutSprite = (cutX, cutY, cutW, cutH, tileWidth, tileHeight) => {
    this.cutX = cutX;
    this.cutY = cutY;
    this.cutW = cutW;
    this.cutH = cutH;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }

  setAnimation = (animation, time = 0.2, repeat = true) => {
    this.stop();
    this.clock.oldSec = -1;
    this.clock.current = 0;
    this.clock.time = time;
    this.clock.repeat = repeat;
    this.frame = 0;
    this.frames = animation.length - 1;
    this.animation = animation;
    this.time = time;
    this.repeat = repeat;
  };

  changeAnimation = (animation, time = 0.2, repeat = true) => {
    this.clock =
      this.clock === undefined
        ? new Clock(this._GAME, time, repeat)
        : this.clock;
    this.stop();
    this.frame = 0;
    this.frames = animation.length - 1;
    this.animation = animation;
    this.time = time;
    this.repeat = repeat;
    this.play();
  };

  steps = () => {
    if (!this.clock) return;

    this.clock.tick(() => {
      if (this.repeat) {
        this.frame = this.frame >= this.frames ? 0 : this.frame + 1;
      } else {
        this.frame = this.frame < this.frames ? this.frame + 1 : this.frame;
      }

      if (!this.repeat && this.frame >= this.frames) {
        this.stop();
        this.onEnd();
      }
    });

    // cambiar medidas de recorte segun el frame
    if (this.frames === -1) return;

    this.cutX = this.animation[this.frame].cutX;
    this.cutY = this.animation[this.frame].cutY;
    this.cutW = this.animation[this.frame].cutW;
    this.cutH = this.animation[this.frame].cutH;
    this.tileWidth = this.animation[this.frame].tileWidth;
    this.tileHeight = this.animation[this.frame].tileHeight;
  };
}
