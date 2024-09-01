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

    target.addEventListener("keydown", (e) => this._OnKeyDown(e));
    target.addEventListener("keyup", (e) => this._OnKeyUp(e));
    target.addEventListener("mousedown", (e) => this._OnMouseDown(e));
    target.addEventListener("mouseup", (e) => this._OnMouseUp(e));
    target.addEventListener("mousemove", (e) => this._OnMouseMove(e));
    target.addEventListener("contextmenu", (e) => e.preventDefault());
    target.addEventListener("blur", (e) => {
      this.keydown.clear();
      this.keypress.clear();
      this.keyup.clear();
      this.mousedown.clear();
      this.mousepress.clear();
      this.mouseup.clear();
    });
  }

  /**
   *
   * @param {string} key
   * @returns
   */
  GetKeyDown = (key) => {
    let down = this.keydown.has(key);
    this.keydown.delete(key);
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
    this.keyup.delete(key);
    return up;
  };
  /**
   *
   * @param {number} button
   * @returns
   */
  GetMouseDown = (button) => {
    let down = this.mousedown.has(button);
    this.mousedown.delete(button);
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
    this.mouseup.delete(button);
    return up;
  };

  /**
   *
   * @returns
   */
  GetMouseCords = () => {
    return this.mouseCord;
  };

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
}
