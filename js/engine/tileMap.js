import Obj from "./object.js";

export default class TileMap extends Obj{
    constructor(game, url = undefined, tileWidth, tileHeight){
        super(game, 0, 0, 0, 0);
        this.img = new Image();
        this.img.src = url;
        this.tiles = [];
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    addTile = (x, y, ofSetX, ofSetY, cutW, cutH) => {
        this.tiles.push({x: x, y: y, ofSetX: ofSetX, ofSetY: ofSetY, cutW: cutW, cutH: cutH});
    }

    draw = (ctx) => {

        const camaX = this.GAME.room.room.camara ? this.GAME.room.room.camara.x : 0;
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
        })
        
    }
}