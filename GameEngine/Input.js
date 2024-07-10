export default class Input {
  /**
   * 
   * @param {string} key 
   * @returns
   */
  static GetKeyDown = (key) => {
    let down = this.keydown.has(key);
    this.keydown.delete(key);
    return down;
  };

  /**
   * 
   * @param {string} key 
   * @returns 
   */
  static GetKeyPress = (key) => {
    return this.keypress.has(key);
  };

  /**
   * 
   * @param {string} key 
   * @returns 
   */
  static GetKeyUp = (key) => {
    let up = this.keyup.has(key);
    this.keyup.delete(key);
    return up;
  };
  /**
   * 
   * @param {number} button 
   * @returns 
   */
  static GetMouseDown = (button) => {
    let down = this.mousedown.has(button);
    this.mousedown.delete(button);
    return down;
  };

  /**
   * 
   * @param {number} button 
   * @returns 
   */
  static GetMousePress = (button) => {
    return this.mousepress.has(button);
  };

  /**
   * 
   * @param {number} button 
   * @returns 
   */
  static GetMouseUp = (button) => {
    let up = this.mouseup.has(button);
    this.mouseup.delete(button);
    return up;
  };

  /**
   * 
   * @returns 
   */
  static GetMouseCords = () => {
    return this.mouseCord;
  };

  /**
   * 
   * @param {KeyboardEvent} e 
   */
  static _OnKeyDown = (e) => {
    this.keydown.add(e.key);
    this.keypress.add(e.key);
    this.keyup.delete(e.key);
  };
  /**
   * 
   * @param {KeyboardEvent} e 
   */
  static _OnKeyUp = (e) => {
    this.keyup.add(e.key);
    this.keydown.delete(e.key);
    if (this.keypress.has(e.key)) this.keypress.delete(e.key);
  };
  /**
   * 
   * @param {MouseEvent} e 
   */
  static _OnMouseDown = (e) => {
    this.mousedown.add(e.button);
    this.mousepress.add(e.button);
    this.mouseup.delete(e.button);
  };
  /**
   * 
   * @param {MouseEvent} e 
   */
  static _OnMouseUp = (e) => {
    this.mouseup.add(e.button);
    this.mousedown.delete(e.button);
    if (this.mousepress.has(e.button)) this.mousepress.delete(e.button);
  };
  /**
   * 
   * @param {MouseEvent} e 
   */
  static _OnMouseMove = (e) => {
    const scaleX = this._GAME.viewport.x / this._GAME.$.clientWidth;
    const scaleY = this._GAME.viewport.y / this._GAME.$.clientHeight;

    this.mouseCord = {
      x: e.offsetX * scaleX,
      y: e.offsetY * scaleY,
    };
  };

  /**
   * 
   * @param {object} GAME 
   * @param {HTMLCanvasElement} target 
   * @returns 
   */
  static Init(GAME, target) {
    if (!target) return;

    Input._GAME = GAME;

    target.addEventListener("keydown", Input._OnKeyDown.bind(this));
    target.addEventListener("keyup", Input._OnKeyUp.bind(this));
    target.addEventListener("mousedown", Input._OnMouseDown.bind(this));
    target.addEventListener("mouseup", Input._OnMouseUp.bind(this));
    target.addEventListener("mousemove", Input._OnMouseMove.bind(this));
    target.addEventListener("contextmenu", (e) => e.preventDefault());
    target.addEventListener("blur", (e) => {
      Input.keydown.clear();
      Input.keypress.clear();
      Input.keyup.clear();
      Input.mousedown.clear();
      Input.mousepress.clear();
      Input.mouseup.clear();
    });
  }
}
Input._GAME;
Input.keydown = new Set();
Input.keypress = new Set();
Input.keyup = new Set();
Input.mousedown = new Set();
Input.mousepress = new Set();
Input.mouseup = new Set();
Input.mouseCord = { x: 0, y: 0 };