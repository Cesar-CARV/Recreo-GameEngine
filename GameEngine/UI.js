import Input from "./Input.js";
import Object from "./Object.js";

export default class UI extends Object {
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

  draw = (ctx) => {};

  checkMousePosition = () => {
    if (this.constructor.name === "UI" || this.container) return;

    if (
      Input.GetMouseCords().x >= this.position.x &&
      Input.GetMouseCords().x <= this.position.x + this.size.x &&
      Input.GetMouseCords().y >= this.position.y &&
      Input.GetMouseCords().y <= this.position.y + this.size.y
    ) {
      this.hover = true;
      this._GAME.hoverUI = true;
    } else if (this.active && Input.GetMouseDown(0)) {
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
    if (this.mouseOn && Input.GetMouseDown(0)) {
      this.onMouseDown();
      this.pressed = true;
      if (!this.active) {
        this.onFocus();
      }
      this.active = true;
    }
    if (this.mouseOn && this.active && this.pressed && Input.GetMouseUp(0)) {
      this.onMouseUp();
      this.onClick();
      this.pressed = false;
    }
    if (this.mouseOn && this.lastMouseCord !== Input.GetMouseCords()) {
      this.onMouseMove();
      this.lastMouseCord = Input.GetMouseCords();
    }
    if (this.active && Input.keydown.size !== 0) {
      this.onKeyDown();
    }
    if (this.active && Input.keyup.size !== 0) {
      this.onKeyUp();
    }
  };

  steps = () => {};

  main = (ctx) => {
    if (this.visible) {
      this.updatePosition();
      this.events();
      this.steps();
      this.draw(ctx);
      //   this.restartPosition();
    }
  };
}
