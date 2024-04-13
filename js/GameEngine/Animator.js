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
    }

    play = () => {
        this.frame = this.frame > this.frames ? this.frames : this.frame;

        this.#animationLoop = setInterval(() => {
            if (this._GAME.pauseGame) return;

            if (this.repeat)
                this.frame = this.frame >= this.frames ? 0 : this.frame + 1;
            else
                this.frame =
                    this.frame < this.frames ? this.frame + 1 : this.frame;

            if (!this.repeat && this.frame >= this.frames) this.stopAnimation();
        }, this.time);
    };

    stop = () => {
        clearInterval(this.#animationLoop);
    };

    steps = () => {
        if (this.frames === -1 || this._CHILDREN.length === 0) return;

        this._CHILDREN[0].obj.cutX = this.keyFrames[this.frame].cutX;
        this._CHILDREN[0].obj.cutY = this.keyFrames[this.frame].cutY;
        this._CHILDREN[0].obj.cutW = this.keyFrames[this.frame].cutW;
        this._CHILDREN[0].obj.cutH = this.keyFrames[this.frame].cutH;
        this._CHILDREN[0].obj.tileWidth = this.keyFrames[this.frame].tileWidth;
        this._CHILDREN[0].obj.tileHeight = this.keyFrames[this.frame].tileHeight;
    };
}

export { SpriteAnimator, KeyFrame };
