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
    #animationLoop = undefined;
    constructor(GAME, keyFrames, time = 1000 / 12, repeat = true) {
        super(GAME, 0, 0, 0, 0);
        this.frame = 0;
        this.frames = keyFrames.length - 1;
        this.keyFrames = keyFrames;
        this.time = time;
        this.repeat = repeat;
        // this.clock = new Clock(GAME, this.time, true)
    }

    play = () => {
        this.frame = this.frame > this.frames ? this.frames : this.frame;

        this.#animationLoop = setInterval(() => {
            if (this._GAME.gamePaused) return;

            if (this.repeat){
                this.frame = this.frame >= this.frames ? 0 : this.frame + 1;
            }
            else {
                this.frame =
                this.frame < this.frames ? this.frame + 1 : this.frame;
            }
            
            if (!this.repeat && this.frame >= this.frames) this.stopAnimation();
        }, this.time);
    };

    stop = () => {
        clearInterval(this.#animationLoop);
    };

    changeAnimation =  (keyFrames, time = 1000 / 12, repeat = true) => {
        this.stop();
        this.frame = 0;
        this.frames = keyFrames.length - 1;
        this.keyFrames = keyFrames;
        this.time = time;
        this.repeat = repeat;
        this.play();
    }

    steps = () => {
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
