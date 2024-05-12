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

    const FX = this.flipX ? -1 : 1;
    const FY = this.flipY ? -1 : 1;

    ctx.save()
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
}
