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
    // ! TEST
    if (Object.values(this._GAME.input.screenTouches).length !== 0) return;
    // ! End TEST

    // Determine if the mouse is over the UI area
    if (
      this._GAME.input.GetMouseCords().x >= this.position.x &&
      this._GAME.input.GetMouseCords().x <= this.position.x + this.size.x &&
      this._GAME.input.GetMouseCords().y >= this.position.y &&
      this._GAME.input.GetMouseCords().y <= this.position.y + this.size.y
    ) {
      this.hover = true;
      this._GAME.hoverUI = true;
    } 
    // Check if the mouse is clicking outside the UI area
    else if (this.active && this._GAME.input.GetMouseDown(0)) {
      this.active = false;
      this.onBlur();
    } else if (this.hover) {
      this.pressed = false;
      this.leave = true;
      this.hover = false;
      this._GAME.hoverUI = false;
    }
  };

  // Events
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

    // ? MOUSE DISPATCHER EVENT
    // Hover
    if (this.hover && !this.mouseOn) {
      this.onMouseHover();
      this.mouseOn = true;
    }
    
    // Leave
    if (this.leave) {
      this.onMouseLeave();
      this.leave = false;
      this.mouseOn = false; /* this.active = false;*/
    }
    
    // Mouse Down / Focus
    if (this.mouseOn && this._GAME.input.GetMouseDown(0)) {
      this.onMouseDown();
      this.pressed = true;
      if (!this.active) {
        this.onFocus();
      }
      this.active = true;
    }
    
    // Mouse up / Click
    if (
      this.mouseOn &&
      this.active &&
      this.pressed &&
      this._GAME.input.GetMouseUp(0)
    ) {
      this.onMouseUp();
      this.onClick();
      this.pressed = false;
    }
    
    // Mouse move
    if (
      this.mouseOn &&
      this.lastMouseCord !== this._GAME.input.GetMouseCords()
    ) {
      this.onMouseMove();
      this.lastMouseCord = this._GAME.input.GetMouseCords();
    }
    
    // ? KEYBOARD DISPATCHER EVENT
    // Key down
    if (this.active && this._GAME.input.keydown.size !== 0) {
      this.onKeyDown();
    }
    
    // Key up
    if (this.active && this._GAME.input.keyup.size !== 0) {
      this.onKeyUp();
    }

    // ? TOUCH DISPATCHER EVENT
    // Touch down
    if (
      this._GAME.input.GetTouchDownOnArea(
        this.position.x,
        this.position.y,
        this.position.x + this.size.x,
        this.position.y + this.size.y
      )
    ) {
      this.hover = true;
      this.pressed = true;
      this.onMouseDown();
      this.onFocus();
    } 

    // Touch up
    if (
      this._GAME.input.GetTouchUpOnArea(
        this.position.x,
        this.position.y,
        this.position.x + this.size.x,
        this.position.y + this.size.y
      )
    ) {
      this.onMouseUp();
      this.onClick();
      this.onBlur();
      this.hover = false;
      this.pressed = false;
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
    
    // ! CHECK FOR ERRORS
    this.steps(deltaTime);
    // ! END

    if (this.visible) {
      this.updatePosition();
      this.events();
      this.draw(ctx);
      //   this.restartPosition();
    }
  };
}
