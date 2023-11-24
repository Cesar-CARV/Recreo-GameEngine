import Obj from "./object.js";

export default class TileMap extends Obj{
    constructor(game, url = undefined){
        super(game, 0, 0, 0, 0);
        this.img = new Image();
        this.img.src = url;
        this.tiles = [];
    }

    addTile = (x, y, w, h) => {
        this.tiles.push({ x: x, y: y, w: w, h: h });
    }

    draw = (ctx) => {
        
    }
}