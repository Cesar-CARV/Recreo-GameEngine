export default class Input {
  /**
   *
   * @param {object} GAME
   * @param {HTMLCanvasElement} target
   * @returns
   */
  constructor(GAME, target) {
    if (!target) return;

    this._GAME = GAME;
    this.keydown = new Set();
    this.keypress = new Set();
    this.keyup = new Set();
    this.mousedown = new Set();
    this.mousepress = new Set();
    this.mouseup = new Set();
    this.mouseCord = { x: 0, y: 0 };

    this.screenTouchesDown = {};
    this.screenTouchesUp = {};
    this.screenTouches = {};

    target.addEventListener("keydown", (e) => this._OnKeyDown(e));
    target.addEventListener("keyup", (e) => this._OnKeyUp(e));
    target.addEventListener("mousedown", (e) => this._OnMouseDown(e));
    target.addEventListener("mouseup", (e) => this._OnMouseUp(e));
    target.addEventListener("mousemove", (e) => this._OnMouseMove(e));
    target.addEventListener("contextmenu", (e) => e.preventDefault());
    target.addEventListener("touchstart", (e) => this._OnTouchStart(e));
    target.addEventListener("touchend", (e) => this._OnTouchEnd(e));
    target.addEventListener("touchmove", (e) => this._OnTouchMove(e));

    target.addEventListener("blur", (e) => {
      this.keydown.clear();
      this.keypress.clear();
      this.keyup.clear();
      this.mousedown.clear();
      this.mousepress.clear();
      this.mouseup.clear();
      this.screenTouches = {};
      this.screenTouchesDown = {};
      this.screenTouchesUp = {};
    });
  }

  ClearKeys = () => {
    this.keyup.clear();
    this.mouseup.clear();
    this.keydown.clear();
    this.mousedown.clear();
    this.screenTouchesDown = {};
    this.screenTouchesUp = {};
  };

  // ? KEYBOARD
  /**
   *
   * @param {string} key
   * @returns
   */
  GetKeyDown = (key) => {
    let down = this.keydown.has(key);
    // this.keydown.delete(key);
    return down;
  };

  /**
   *
   * @param {string} key
   * @returns
   */
  GetKeyPress = (key) => {
    return this.keypress.has(key);
  };

  /**
   *
   * @param {string} key
   * @returns
   */
  GetKeyUp = (key) => {
    let up = this.keyup.has(key);
    return up;
  };

  // ? MOUSE
  /**
   *
   * @param {number} button
   * @returns
   */
  GetMouseDown = (button) => {
    let down = this.mousedown.has(button);
    // this.mousedown.delete(button);
    return down;
  };

  /**
   *
   * @param {number} button
   * @returns
   */
  GetMousePress = (button) => {
    return this.mousepress.has(button);
  };

  /**
   *
   * @param {number} button
   * @returns
   */
  GetMouseUp = (button) => {
    let up = this.mouseup.has(button);
    return up;
  };

  /**
   *
   * @returns
   */
  GetMouseCords = () => {
    return this.mouseCord;
  };

  // ? TOUCH
  GetTouches = () => Object.values(this.screenTouches);

  GetTouchesDown = () => Object.values(this.screenTouchesDown);

  /**
   *
   * @param {object} touches
   * @param {number} x
   * @param {number} y
   * @param {number} x2
   * @param {number} y2
   */
  #_filterTouchOnArea = (touches, x, y, x2, y2) => {
    let target = null;
    for (let i = 0; i < touches.length; i++) {
      if (
        touches[i].x + touches[i].radius >= x &&
        touches[i].x - touches[i].radius <= x2 &&
        touches[i].y + touches[i].radius >= y &&
        touches[i].y - touches[i].radius <= y2
      ) {
        target = touches[i];
        break;
      }
    }

    return target;
  };

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} x2
   * @param {number} y2
   */
  GetTouchOnArea = (x, y, x2, y2) => {
    return this.#_filterTouchOnArea(
      Object.values(this.screenTouches),
      x,
      y,
      x2,
      y2
    );
  };

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} x2
   * @param {number} y2
   */
  GetTouchDownOnArea = (x, y, x2, y2) => {
    return this.#_filterTouchOnArea(
      Object.values(this.screenTouchesDown),
      x,
      y,
      x2,
      y2
    );
  };

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} x2
   * @param {number} y2
   */
  GetTouchUpOnArea = (x, y, x2, y2) => {
    return this.#_filterTouchOnArea(
      Object.values(this.screenTouchesUp),
      x,
      y,
      x2,
      y2
    );
  };

  // ? Local Methods
  // ? KEYBOARD
  /**
   *
   * @param {KeyboardEvent} e
   */
  _OnKeyDown = (e) => {
    this.keydown.add(e.key);
    this.keypress.add(e.key);
    this.keyup.delete(e.key);
  };

  /**
   *
   * @param {KeyboardEvent} e
   */
  _OnKeyUp = (e) => {
    this.keyup.add(e.key);
    this.keydown.delete(e.key);
    if (this.keypress.has(e.key)) this.keypress.delete(e.key);
  };

  // ? MOUSE
  /**
   *
   * @param {MouseEvent} e
   */
  _OnMouseDown = (e) => {
    this.mousedown.add(e.button);
    this.mousepress.add(e.button);
    this.mouseup.delete(e.button);
  };
  /**
   *
   * @param {MouseEvent} e
   */
  _OnMouseUp = (e) => {
    this.mouseup.add(e.button);
    this.mousedown.delete(e.button);
    if (this.mousepress.has(e.button)) this.mousepress.delete(e.button);
  };
  /**
   *
   * @param {MouseEvent} e
   */
  _OnMouseMove = (e) => {
    const scaleX = this._GAME.viewport.x / this._GAME.$.clientWidth;
    const scaleY = this._GAME.viewport.y / this._GAME.$.clientHeight;

    this.mouseCord = {
      x: e.offsetX * scaleX,
      y: e.offsetY * scaleY,
    };
  };

  // ? TOUCH
  /**
   *
   * @param {e: TouchEvent} e
   */
  _OnTouchStart = (e) => {
    e.preventDefault();
    const scaleX = this._GAME.viewport.x / this._GAME.$.clientWidth;
    const scaleY = this._GAME.viewport.y / this._GAME.$.clientHeight;

    [...e.changedTouches].forEach((touch) => {
      this.screenTouches[touch.identifier] = {
        id: touch.identifier,
        x: (touch.clientX - e.target.getBoundingClientRect().left) * scaleX,
        y: (touch.clientY - e.target.getBoundingClientRect().top) * scaleY,
        radius: Math.floor(touch.radiusX),
      };
    });

    this.screenTouchesDown = this.screenTouches;
  };

  /**
   *
   * @param {e: TouchEvent} e
   */
  _OnTouchEnd = (e) => {
    e.preventDefault();
    const scaleX = this._GAME.viewport.x / this._GAME.$.clientWidth;
    const scaleY = this._GAME.viewport.y / this._GAME.$.clientHeight;

    [...e.changedTouches].forEach((touch) => {
      this.screenTouchesUp[touch.identifier] = this.screenTouches[
        touch.identifier
      ] = {
        id: touch.identifier,
        x: (touch.clientX - e.target.getBoundingClientRect().left) * scaleX,
        y: (touch.clientY - e.target.getBoundingClientRect().top) * scaleY,
        radius: Math.floor(touch.radiusX),
      };
      delete this.screenTouches[touch.identifier];
    });
  };

  /**
   *
   * @param {e: TouchEvent} e
   */
  _OnTouchMove = (e) => {
    e.preventDefault();
    const scaleX = this._GAME.viewport.x / this._GAME.$.clientWidth;
    const scaleY = this._GAME.viewport.y / this._GAME.$.clientHeight;

    [...e.changedTouches].forEach((touch) => {
      this.screenTouches[touch.identifier].x =
        (touch.clientX - e.target.getBoundingClientRect().left) * scaleX;
      this.screenTouches[touch.identifier].y =
        (touch.clientY - e.target.getBoundingClientRect().top) * scaleY;
    });
  };
}
