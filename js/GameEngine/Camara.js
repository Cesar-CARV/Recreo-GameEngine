import Object from "./Object.js";
import Vector2 from "./Vector2.js";

export default class Camara extends Object {
    constructor(GAME, x, y, w, h) {
        super(GAME, x, y, w, h);
        this.ABSOLUTEPOSITION = new Vector2(x, y);
        this.MODES = { Center: "Center", Borders: "Borders" };
        this.mode = this.MODES.Center;
        this.padding = 50;
        this.scaleX = 1;
        this.scaleY = 1;
        this._ROOM = undefined;
    }

    setScale = (x, y) => {
        this.scaleX = x;
        this.scaleY = y;
    };

    steps = () => {
        if (!this._ROOM) {
            this._ROOM = this._GAME.currentRoom;
        } else {
            this._ROOM.scaleContextRoom.x = this.scaleX;
            this._ROOM.scaleContextRoom.y = this.scaleY;

            this._ROOM.sizeContextRoom = this.size;
            this._ROOM.positionContextRoom.x = -this.position.x;
            this._ROOM.positionContextRoom.y = -this.position.y;
        }
    };

    // actualiza la posicion de el objeto segun la posicion del padre
    updatePosition = () => {
        this.position = this._PARENT
            ? new Vector2(
                  this._PARENT.position.x +
                      this.position.x -
                      this.size.x / 2 +
                      this._PARENT.size.x / 2,
                  this._PARENT.position.y +
                      this.position.y -
                      this.size.y / 2 +
                      this._PARENT.size.y / 2
              )
            : this.position;
    };

    // reinicia la posicion del objeto para que no cresca exponecialmente al sumar la posicion del padre
    restartPosition = () => {
        this.position = this._PARENT
            ? new Vector2(
                  this.position.x -
                      this._PARENT.position.x +
                      this.size.x / 2 -
                      this._PARENT.size.x / 2,
                  this.position.y -
                      this._PARENT.position.y +
                      this.size.y / 2 -
                      this._PARENT.size.y / 2
              )
            : this.position;
    };
}
