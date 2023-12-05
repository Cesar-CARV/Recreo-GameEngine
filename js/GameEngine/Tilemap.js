import Object from "./Object.js";

export default class Tilemap extends Object{
    constructor(game, url = undefined, tileWidth, tileHeight){
        super(game, 0, 0, 0, 0);
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

    addTile = (x, y, ofSetX, ofSetY, cutW, cutH) => {
        this.tiles.push({x: x, y: y, ofSetX: ofSetX, ofSetY: ofSetY, cutW: cutW, cutH: cutH});
    }

    draw = (ctx) => {
        if (!this.canDraw) return;

        if (this.tileImage === undefined) {
            let canvasTemp = document.createElement('canvas');
            canvasTemp.setAttribute("width", this._GAME.currentRoom.w,);
            canvasTemp.setAttribute("height", this._GAME.currentRoom.h);
            let ctxTemp = canvasTemp.getContext('2d');
            ctxTemp.imageSmoothingEnabled = false;
            this.tileImage = new Image(this._GAME.currentRoom.w, this._GAME.currentRoom.h);

            this.tiles.forEach(tile => {
                ctxTemp.drawImage(
                    this._IMAGE, // image
                    tile.ofSetX, // cut x
                    tile.ofSetY, // cut y
                    tile.cutW, // cut w
                    tile.cutH, // cut h
                    tile.x, // image x
                    tile.y, // image y
                    this.tileWidth, // image w
                    this.tileHeight // image h
                );
            });

            this.tileImage.src = canvasTemp.toDataURL();
        }
        else {
            ctx.drawImage(
                this.tileImage, // image
                this.x, // image x
                this.y, // image y
                this._GAME.currentRoom.w,
                this._GAME.currentRoom.h
            );
        }
    }
}