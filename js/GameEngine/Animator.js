class KeyFrame {
    constructor(cutX, cutY, cutW, cutH, w, h, offsetX = 0, offsetY = 0) {
        this.cutX = cutX;
        this.cutY = cutY;
        this.cutW = cutW;
        this.cutH = cutH;
        this.w = w;
        this.h = h;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}

class SpriteAnimator {
    #animationLoop = undefined;

    constructor(parent, sprite, keyFrames, follow = true, time = 1000 / 12, repeat = true) {
        this.parent = parent
        this.sprite = sprite;
        this.frame = 0;
        this.frames = keyFrames.length - 1;
        this.keyFrames = keyFrames;
        this.follow = follow;
        this.time = time;
        this.repeat = repeat;
    }

    playAnimation = () => {
        
        this.frame = this.frame > this.frames ? this.frames : this.frame;
        
        this.#animationLoop = setInterval(() => {
            if (this.parent._GAME.pauseGame) return;
            
            if (this.repeat) this.frame = this.frame >= this.frames ? 0 : this.frame + 1;
            else this.frame = this.frame < this.frames ? this.frame + 1 : this.frame;

            if (!this.repeat && this.frame >= this.frameLimit) this.stopAnimation();
        }, this.time);
    }

    stopAnimation = () => {
        clearInterval(this.#animationLoop);
    }

    main = (ctx) => {
        if (this.frames === -1 && !this.follow) { this.sprite.draw(ctx); }
        else if (this.frames === -1 && this.follow) { this.sprite.drawFollowTarget(ctx, this.parent); }
        else if (this.frames >= 0 && !this.follow) {
            this.sprite.drawCut(
                ctx, 
                this.keyFrames[this.frame].cutX,
                this.keyFrames[this.frame].cutY,
                this.keyFrames[this.frame].cutW,
                this.keyFrames[this.frame].cutH,
                this.keyFrames[this.frame].offsetX,
                this.keyFrames[this.frame].offsetY,
                this.keyFrames[this.frame].w,
                this.keyFrames[this.frame].h
            );
        }
        else if (this.frames >= 0 && this.follow) {
            this.sprite.drawCutAndFollowTarget(
                ctx,
                this.parent,
                this.keyFrames[this.frame].cutX,
                this.keyFrames[this.frame].cutY,
                this.keyFrames[this.frame].cutW,
                this.keyFrames[this.frame].cutH,
                this.keyFrames[this.frame].offsetX,
                this.keyFrames[this.frame].offsetY,
                this.keyFrames[this.frame].w,
                this.keyFrames[this.frame].h
            );
        }
    }
    
}

export {SpriteAnimator, KeyFrame};