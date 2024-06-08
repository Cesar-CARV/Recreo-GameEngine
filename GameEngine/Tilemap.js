import Object from "./Object.js";

export default class Tilemap extends Object {
  constructor(GAME, url = undefined, width, height, tileWidth, tileHeight) {
    super(GAME, 0, 0, width, height);
    this._IMAGE = new Image();
    this._IMAGE.src = url;
    this.canDraw = false;
    this._IMAGE.onload = () => {
      this.canDraw = true;
    };
    this.tiles = [];
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileImage = undefined;
  }

  // * x -> posicion en el grid
  // * y -> posicion en le grid
  // * row -> row de recorte de la imagen
  // * col -> col de recorte de la imagen
  addTile = (x, y, row, col, cutW, cutH) => {
    this.tiles.push({
      x: x,
      y: y,
      row: row,
      col: col,
      cutW: cutW,
      cutH: cutH
    });
  };

  draw = (ctx) => {
    if (!this.canDraw) return;

    if (this.tileImage === undefined) {
      let canvasTemp = document.createElement("canvas");
      canvasTemp.setAttribute("width", this.size.x);
      canvasTemp.setAttribute("height", this.size.y);

      let ctxTemp = canvasTemp.getContext("2d");
      ctxTemp.imageSmoothingEnabled = false;
      
      this.tileImage = new Image();

      this.tiles.forEach((tile) => {
        ctxTemp.drawImage(
          this._IMAGE, // image
          tile.row * tile.cutW, // cut x
          tile.col * tile.cutH, // cut y
          tile.cutW, // cut w
          tile.cutH, // cut h
          tile.x * this.tileWidth, // image x
          tile.y * this.tileHeight, // image y
          this.tileWidth, // image w
          this.tileHeight // image h
        );
      });

      this.tileImage.src = canvasTemp.toDataURL();
    } else {
      ctx.drawImage(
        this.tileImage, // image
        this.position.x, // image x
        this.position.y // image y
      );
    }
  };
}
