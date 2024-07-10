import Vector2 from "./Vector2.js";

export default class Background {
  /**
   * 
   * @param {object} GAME 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   * @param {string} imageURL 
   * @param {string} color 
   */
  constructor(GAME, x, y, w, h, imageURL = undefined, color = undefined) {
    this._NAME = undefined;
    this._GAME = GAME;
    this.position = new Vector2(x, y);
    this.size = new Vector2(w, h);

    this._IMAGE = new Image();
    this._IMAGE.src = imageURL !== undefined ? imageURL : "";
    this.url = imageURL !== undefined;
    this.canDraw = imageURL === undefined ? true : false;
    this._IMAGE.onload = () => {
      this.canDraw = true;
    };
    this.color = color;
    this.static = false;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @returns 
   */
  draw = (ctx) => {
    if (!this.canDraw) return;

    if (this.url) {
      ctx.drawImage(
        this._IMAGE,
        this.position.x +
          (this.static ? -this._GAME.currentRoom.positionContextRoom.x : 0),
        this.position.y +
          (this.static ? -this._GAME.currentRoom.positionContextRoom.y : 0),
        this.size.x,
        this.size.y
      );
    }
    else if (this.color) {
      ctx.fillStyle = this.color;
      ctx.fillRect(
        this.position.x +
          (this.static ? -this._GAME.currentRoom.positionContextRoom.x : 0),
        this.position.y +
          (this.static ? -this._GAME.currentRoom.positionContextRoom.y : 0),
        this.size.x,
        this.size.y
      );
    }
  };

  steps = () => {};

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  main = (ctx) => {
    this.steps();
    this.draw(ctx);
  };
}
