import Clock from "./Clock.js";
import Object from "./Object.js";

class KeyFrame {
  constructor(cutX, cutY, cutW, cutH, tileWidth, tileHeight) {
    this.cutX = cutX;
    this.cutY = cutY;
    this.cutW = cutW;
    this.cutH = cutH;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }
}

class SpriteAnimator extends Object {
  constructor(GAME, keyFrames, time = .2, repeat = true) {
    super(GAME, 0, 0, 0, 0);
    this.frame = 0;
    this.frames = keyFrames.length - 1;
    this.keyFrames = keyFrames;
    this.time = time;
    this.repeat = repeat;
    this.clock = new Clock(GAME, this.time, this.repeat);
  }

  changeAnimation = (keyFrames, time = .2, repeat = true) => {
    this.stop();
    this.frame = 0;
    this.frames = keyFrames.length - 1;
    this.keyFrames = keyFrames;
    this.time = time;
    this.repeat = repeat;
    this.play();
  };

  play = () => {
    this.clock.start();
  };

  stop = () => {
    this.clock.pause();
  };

  steps = () => {
    this.clock.tick(() => {
      if (this.repeat) {
        this.frame = this.frame >= this.frames ? 0 : this.frame + 1;
      } else {
        this.frame = this.frame < this.frames ? this.frame + 1 : this.frame;
      }

      if (!this.repeat && this.frame >= this.frames) this.stop();
    });

    if (this.frames === -1 || this._CHILDREN.length === 0) return;

    window.Object.values(this._CHILDREN)[0].cutX = this.keyFrames[this.frame].cutX;
    window.Object.values(this._CHILDREN)[0].cutY = this.keyFrames[this.frame].cutY;
    window.Object.values(this._CHILDREN)[0].cutW = this.keyFrames[this.frame].cutW;
    window.Object.values(this._CHILDREN)[0].cutH = this.keyFrames[this.frame].cutH;
    window.Object.values(this._CHILDREN)[0].tileWidth = this.keyFrames[this.frame].tileWidth;
    window.Object.values(this._CHILDREN)[0].tileHeight = this.keyFrames[this.frame].tileHeight;
  };
}

export { SpriteAnimator, KeyFrame };
