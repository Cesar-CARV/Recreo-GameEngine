import Object from "./Object.js";

// esta clase puede quedar igual ya que como no se puede agregar como hijo a otra clase no pasa nada
class KeyFrame {
    constructor(cutX, cutY, cutW, cutH, tileWidth, tileHeight) {
        this.cutX = cutX;
        this.cutY = cutY;
        this.cutW = cutW;
        this.cutH = cutH;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        // this.w = w;
        // this.h = h;
        // this.offsetX = offsetX;
        // this.offsetY = offsetY;
    }
}

// PENDIENTE MODIFICAR SpriteAnimator
// dado que SpriteAnimator es un objeto que puede ser agregado como hijo a otros objetos este tambien
// deberia de heredar de la clase Object para que no cause problemas a la hora de renderizar
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
// class SpriteAnimator {
//     #animationLoop = undefined;

//     constructor(parent, sprite, keyFrames, follow = true, time = 1000 / 12, repeat = true) {
//         this.parent = parent
//         this.sprite = sprite;
//         this.frame = 0;
//         this.frames = keyFrames.length - 1;
//         this.keyFrames = keyFrames;
//         this.follow = follow;
//         this.time = time;
//         this.repeat = repeat;
//     }

//     play = () => {

//         this.frame = this.frame > this.frames ? this.frames : this.frame;

//         this.#animationLoop = setInterval(() => {
//             if (this.parent._GAME.pauseGame) return;

//             if (this.repeat) this.frame = this.frame >= this.frames ? 0 : this.frame + 1;
//             else this.frame = this.frame < this.frames ? this.frame + 1 : this.frame;

//             if (!this.repeat && this.frame >= this.frameLimit) this.stopAnimation();
//         }, this.time);
//     }

//     stop = () => {
//         clearInterval(this.#animationLoop);
//     }

//     // una vez que SpriteAnimator herede de la clase Object todo lo que hace esta funcion
//     // pasara a estar dentro de la funcion draw ya que lo unico que hace es dibujar los sprites
//     main = (ctx) => {
//         if (this.frames === -1 && !this.follow) { this.sprite.draw(ctx); }
//         else if (this.frames === -1 && this.follow) { this.sprite.drawFollowTarget(ctx, this.parent); }
//         else if (this.frames >= 0 && !this.follow) {
//             this.sprite.drawCut(
//                 ctx,
//                 this.keyFrames[this.frame].cutX,
//                 this.keyFrames[this.frame].cutY,
//                 this.keyFrames[this.frame].cutW,
//                 this.keyFrames[this.frame].cutH,
//                 this.keyFrames[this.frame].offsetX,
//                 this.keyFrames[this.frame].offsetY,
//                 this.keyFrames[this.frame].w,
//                 this.keyFrames[this.frame].h
//             );
//         }
//         else if (this.frames >= 0 && this.follow) {
//             this.sprite.drawCutAndFollowTarget(
//                 ctx,
//                 this.parent,
//                 this.keyFrames[this.frame].cutX,
//                 this.keyFrames[this.frame].cutY,
//                 this.keyFrames[this.frame].cutW,
//                 this.keyFrames[this.frame].cutH,
//                 this.keyFrames[this.frame].offsetX,
//                 this.keyFrames[this.frame].offsetY,
//                 this.keyFrames[this.frame].w,
//                 this.keyFrames[this.frame].h
//             );
//         }
//     }

// }

export { SpriteAnimator, KeyFrame };
