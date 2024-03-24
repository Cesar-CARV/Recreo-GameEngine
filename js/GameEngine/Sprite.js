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
                this.position.x, // sprite x
                this.position.y, // sprite y
                this.tileWidth, // sprite w
                this.tileHeight // sprite h
            );
        } else {
            ctx.drawImage(
                this._IMAGE,
                this.position.x,
                this.position.y,
                this.size.x,
                this.size.y
            );
        }
    };
}