import Game from "./Game.js";
import Object from "./Object.js";

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
    }

    draw = (ctx) => {
        if (!this.canDraw) return;

        const scaleX = this._GAME.currentRoom.scaleContextRoom.x;
        const scaleY = this._GAME.currentRoom.scaleContextRoom.y;

        this._GAME.ctx.save();

        // hacer flip
        if (this.flipX || this.flipY){
            this._GAME.scaleContextGraphic(scaleX * (this.flipX ? -1 : 1), scaleY * (this.flipY ? -1 : 1));
        }

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
                this.position.x * (this.flipX ? -1 : 1) - (this.flipX ? this.tileWidth : 0), // sprite x
                this.position.y * (this.flipY ? -1 : 1) - (this.flipY ? this.tileHeight : 0), // sprite y
                this.tileWidth, // sprite w
                this.tileHeight // sprite h
            );
        } else {
            ctx.drawImage(
                this._IMAGE,
                this.position.x * (this.flipX ? -1 : 1) - (this.flipX ? this.size.x : 0),
                this.position.y * (this.flipY ? -1 : 1) - (this.flipY ? this.size.y : 0),
                this.size.x,
                this.size.y
            );
        }

        this._GAME.ctx.restore();
    };
}
