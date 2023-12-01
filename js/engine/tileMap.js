import Obj from "./object.js";

export default class TileMap extends Obj{
    constructor(game, url = undefined, tileWidth, tileHeight){
        super(game, 0, 0, 0, 0);
        this.img = new Image();
        this.img.src = url;
        this.tiles = [];
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.canvasTemp = document.createElement('canvas'); 
        this.ctxTemp = this.canvasTemp.getContext('2d');
        this.tileImage = undefined;
    }

    addTile = (x, y, ofSetX, ofSetY, cutW, cutH) => {
        this.tiles.push({x: x, y: y, ofSetX: ofSetX, ofSetY: ofSetY, cutW: cutW, cutH: cutH});
    }

    draw = (ctx) => {
        if (this.tileImage === undefined) {

            this.tileImage = new Image(this.GAME.room.room.w, this.GAME.room.room.h);
            this.canvasTemp.setAttribute("width", this.GAME.room.room.w,);
            this.canvasTemp.setAttribute("height", this.GAME.room.room.h);
            this.ctxTemp = this.canvasTemp.getContext('2d');
            this.ctxTemp.imageSmoothingEnabled = false;

            this.tiles.forEach(tile => {
                this.ctxTemp.drawImage(
                    this.img, // image
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

            this.tileImage.src = this.canvasTemp.toDataURL();
        }
        else {
            const camaX = this.GAME.room.room.camara ? this.GAME.room.room.camara.x : 0;
            const camaY = this.GAME.room.room.camara ? this.GAME.room.room.camara.y : 0;

            ctx.drawImage(
                this.tileImage, // image
                this.x - camaX, // image x
                this.y - camaY, // image y
                this.GAME.room.room.w,
                this.GAME.room.room.h
            );
        }

        /*const camaX = this.GAME.room.room.camara ? this.GAME.room.room.camara.x : 0;
        const camaY = this.GAME.room.room.camara ? this.GAME.room.room.camara.y : 0;

        this.tiles.forEach(tile => {
            ctx.drawImage(
                this.img, // image
                tile.ofSetX, // cut x
                tile.ofSetY, // cut y
                tile.cutW, // cut w
                tile.cutH, // cut h
                tile.x - camaX, // image x
                tile.y - camaY, // image y
                this.tileWidth, // image w
                this.tileHeight // image h
            );
        })*/
        
    }
}