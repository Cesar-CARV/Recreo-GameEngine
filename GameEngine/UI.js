import Input from "./Input.js";
import ObjectNode from "./ObjectNode.js";

export default class UI extends ObjectNode {
  #created = false;
  /**
   * 
   * @param {object} game 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   */
  constructor(game, x, y, w, h) {
    super(game, x, y, w, h);
    this.visible = true;
    this.enabled = true;
    this.mouseOn = false;
    this.active = false;
    this.leave = false;
    this.hover = false;
    this.pressed = false;
    this.container = true;
    this.lastMouseCord = { x: -10, y: -10 };
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw = (ctx) => {};

  checkMousePosition = () => {
    if (this.constructor.name === "UI" || this.container) return;

    if (
      this._GAME.input.GetMouseCords().x >= this.position.x &&
      this._GAME.input.GetMouseCords().x <= this.position.x + this.size.x &&
      this._GAME.input.GetMouseCords().y >= this.position.y &&
      this._GAME.input.GetMouseCords().y <= this.position.y + this.size.y
    ) {
      this.hover = true;
      this._GAME.hoverUI = true;
    } else if (this.active && this._GAME.input.GetMouseDown(0)) {
      this.active = false;
      this.onBlur();
    } else if (this.hover) {
      this.pressed = false;
      this.leave = true;
      this.hover = false;
      this._GAME.hoverUI = false;
    }
  };

  onBlur = () => {};
  onClick = () => {};
  onFocus = () => {};
  onMouseDown = () => {};
  onMouseUp = () => {};
  onMouseMove = () => {};
  onMouseHover = () => {};
  onMouseLeave = () => {};
  onKeyDown = () => {};
  onKeyUp = () => {};

  events = () => {
    if (!this.visible || !this.enabled) return;

    this.checkMousePosition();

    if (this.hover && !this.mouseOn) {
      this.onMouseHover();
      this.mouseOn = true;
    }
    if (this.leave) {
      this.onMouseLeave();
      this.leave = false;
      this.mouseOn = false; /* this.active = false;*/
    }
    if (this.mouseOn && this._GAME.input.GetMouseDown(0)) {
      this.onMouseDown();
      this.pressed = true;
      if (!this.active) {
        this.onFocus();
      }
      this.active = true;
    }
    if (this.mouseOn && this.active && this.pressed && this._GAME.input.GetMouseUp(0)) {
      this.onMouseUp();
      this.onClick();
      this.pressed = false;
    }
    if (this.mouseOn && this.lastMouseCord !== this._GAME.input.GetMouseCords()) {
      this.onMouseMove();
      this.lastMouseCord = this._GAME.input.GetMouseCords();
    }
    if (this.active && this._GAME.input.keydown.size !== 0) {
      this.onKeyDown();
    }
    if (this.active && this._GAME.input.keyup.size !== 0) {
      this.onKeyUp();
    }
  };

  steps = (deltaTime) => {};

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  main = (ctx, deltaTime) => {
    if (!this.#created) {
      this.onCreate();
      this.#created = true;
    }
    if (this.visible) {
      this.updatePosition();
      this.events();
      this.steps(deltaTime);
      this.draw(ctx);
      //   this.restartPosition();
    }
  };
}
