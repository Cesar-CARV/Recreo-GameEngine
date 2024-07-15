// GameEngine/Vector2.js
var Vector2 = class _Vector2 {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static get Zero() {
    return new _Vector2(0, 0);
  }
  /**
   * 
   * @returns {Vector2}
   */
  Magnitude() {
    return Math.sqrt(this.sqrMagnitude);
  }
  /**
   * 
   * @returns {Vector2}
   */
  SqrMagnitude() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * 
   * @returns {Vector2}
   */
  Normalized() {
    return this.Copy().Divide(this.magnitude);
  }
  /**
   * 
   * @returns {Vector2}
   */
  Copy() {
    return new _Vector2(this.x, this.y);
  }
  /**
   * 
   * @param {Vector2} vector 
   * @returns {Vector2}
   */
  Sum(vector) {
    if (vector instanceof _Vector2) {
      return new _Vector2(this.x + vector.x, this.y + vector.y);
    }
    return this.Copy();
  }
  /**
   * 
   * @param {Vector2} vector 
   * @returns {Vector2}
   */
  Substract(vector) {
    if (vector instanceof _Vector2) {
      return new _Vector2(this.x - vector.x, this.y - vector.y);
    }
    return this.Copy();
  }
  /**
   * 
   * @param {number} num 
   * @returns {Vector2}
   */
  Multiply(num) {
    return new _Vector2(this.x * num, this.y * num);
  }
  /**
   * 
   * @param {number} num 
   * @returns {Vector2}
   */
  Divide(num) {
    return new _Vector2(this.x / num, this.y / num);
  }
  /**
   * 
   * @param {Vector2} vector 
   * @returns {Vector2}
   */
  DotProduct(vec) {
    return new _Vector2(this.x * vec.x, this.y * vec.y);
  }
  /**
   * 
   * @param {Vector2} vector 
   * @returns {Vector2}
   */
  DotDivision(vec) {
    return new _Vector2(this.x / vec.x, this.y / vec.y);
  }
  /**
   * 
   * @returns {Vector2}
   */
  InvertY() {
    return new _Vector2(this.x, -this.y);
  }
  /**
  * 
  * @returns {Vector2}
  */
  InvertX() {
    return new _Vector2(-this.x, this.y);
  }
  /**
   * 
   * @param {number} angleDeg 
   * @param {Vector2} origin 
   * @returns {Vector2}
   */
  Rotate(angleDeg, origin) {
    const x = this.x - origin.x;
    const y = this.y - origin.y;
    const cos = Math.cos(angleDeg / 2 / Math.PI);
    const sin = Math.sin(angleDeg / 2 / Math.PI);
    let xPrime = x * cos - y * sin;
    let yPrime = x * sin - y * cos;
    xPrime += origin.x;
    yPrime += origin.y;
    return new _Vector2(xPrime, yPrime);
  }
};

// GameEngine/Background.js
var Background = class {
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
  constructor(GAME, x, y, w, h, imageURL = void 0, color = void 0) {
    this._NAME = void 0;
    this._GAME = GAME;
    this.position = new Vector2(x, y);
    this.size = new Vector2(w, h);
    this._IMAGE = new Image();
    this._IMAGE.src = imageURL !== void 0 ? imageURL : "";
    this.url = imageURL !== void 0;
    this.canDraw = imageURL === void 0 ? true : false;
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
        this.position.x + (this.static ? -this._GAME.currentRoom.positionContextRoom.x : 0),
        this.position.y + (this.static ? -this._GAME.currentRoom.positionContextRoom.y : 0),
        this.size.x,
        this.size.y
      );
    } else if (this.color) {
      ctx.fillStyle = this.color;
      ctx.fillRect(
        this.position.x + (this.static ? -this._GAME.currentRoom.positionContextRoom.x : 0),
        this.position.y + (this.static ? -this._GAME.currentRoom.positionContextRoom.y : 0),
        this.size.x,
        this.size.y
      );
    }
  };
  steps = () => {
  };
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  main = (ctx) => {
    this.steps();
    this.draw(ctx);
  };
};

// GameEngine/Object.js
var Object = class {
  #created = false;
  /**
   * 
   * @param {object} GAME 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   */
  constructor(GAME, x, y, w, h) {
    this._GAME = GAME;
    this._NAME = void 0;
    this._PARENT = void 0;
    this._CHILDREN = {};
    this.position = new Vector2(x, y);
    this.size = new Vector2(w, h);
  }
  // al crear 
  onCreate = () => {
  };
  // eliminarse a si mismo
  kamikaze = (callback = () => {
  }) => {
    if (callback) callback();
    if (this?._PARENT?._CHILDREN) {
      this._PARENT._CHILDREN = delete this._PARENT._CHILDREN[this._NAME];
    } else {
      this._GAME.currentRoom.removeInstance(false, this._NAME);
    }
  };
  // actualizar poscion relativa
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  changePosition = (x, y) => {
    this.position = this._PARENT ? new Vector2(this._PARENT.position.x + x, this._PARENT.position.y + y) : new Vector2(x, y);
  };
  // actualiza la posicion de el objeto segun la posicion del padre
  updatePosition = () => {
    this.position = this._PARENT ? new Vector2(
      this._PARENT.position.x + this.position.x,
      this._PARENT.position.y + this.position.y
    ) : this.position;
  };
  // reinicia la posicion del objeto para que no cresca exponecialmente al sumar la posicion del padre
  restartPosition = () => {
    this.position = this._PARENT ? new Vector2(
      this.position.x - this._PARENT.position.x,
      this.position.y - this._PARENT.position.y
    ) : this.position;
  };
  // agrega un hijo al array de _CHILDREN y le agrega un nombre
  /**
   * 
   * @param {Object} obj 
   * @param {string} name 
   */
  addChild = (obj, name) => {
    if (!this._CHILDREN[name]) {
      this._CHILDREN[name] = obj;
      obj._PARENT = this;
      obj._NAME = name;
    } else if (this._CHILDREN[name]) {
      throw new Error(`${name} does exist in UI`);
    }
  };
  // retorna un hijo segun el nombre
  /**
   * 
   * @param {string} name 
   * @returns 
   */
  getChild = (name) => {
    return this._CHILDREN[name];
  };
  // elimina un hijo segun el nombre
  /**
   * 
   * @param {string} name 
   * @returns 
   */
  delteChild = (name) => {
    return delete this._CHILDREN[name];
  };
  // dentro de esta funcion se podra utilizar el ContextGraphic del canvas para dibujar cualquier cosa
  // como recomendacion solo utilizarla para dibujar ya que si se afecta al ContextGraphic de cierto modo
  // esto podria afectar a el resto de el motor
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw = (ctx) => {
  };
  // en este evento es donde se programaran las acciones del objeto,
  // esta es la funcion un bucle del objeto
  steps = () => {
  };
  // como recomendacion no modificar esta funcion ya que esta llama a las funciones internas del objeto
  // al ser renderizado
  // NOTA: si se llega a modificar esta funcion procurar seguir el mismo orden y de preferencia no borrar
  // los metodos originales.
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  main = (ctx) => {
    if (!this.#created) {
      this.onCreate();
      this.#created = true;
    }
    this.updatePosition();
    this.steps();
    this.draw(ctx);
  };
};

// GameEngine/BoxCollider.js
var BoxCollider = class _BoxCollider extends Object {
  /**
   * 
   * @param {object} GAME 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   * @param {number} layer 
   * @param {object[]} exceptions 
   * @param {boolean} show 
   */
  constructor(GAME, x, y, w, h, layer, exceptions = [], show = false) {
    super(GAME, x, y, w, h);
    this.layer = layer;
    this.exceptions = exceptions;
    this.show = show;
    this.absolutePosition = new Vector2(-9999999, -9999999);
    this.collides = /* @__PURE__ */ new Set();
  }
  // actualiza la posicion de el objeto segun la posicion del padre
  updatePosition = () => {
    this.position = this._PARENT ? new Vector2(
      this._PARENT.position.x + this.position.x,
      this._PARENT.position.y + this.position.y
    ) : this.position;
    this.absolutePosition.x = this.position.x;
    this.absolutePosition.y = this.position.y;
  };
  draw = (ctx) => {
    if (this.show) {
      ctx.strokeStyle = "#f00";
      ctx.strokeRect(
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y
      );
    }
  };
  // recorrer arbol de objetos
  /**
   *
   * @param {Function} condition
   * @param {object} node
   * @param {Set<object>} nodesVisited
   * @returns
   */
  iterateTree = (condition, node = void 0, nodesVisited = /* @__PURE__ */ new Set()) => {
    if (node) {
      if (condition(node)) {
        return { res: true, target: node };
      }
      nodesVisited.add(node);
      if (node._CHILDREN.length === 0) {
        return this.iterateTree(condition, node._PARENT, nodesVisited);
      }
      if (node._CHILDREN.length !== 0) {
        const children = window.Object.values(node._CHILDREN).filter(
          (nd) => !nodesVisited.has(nd)
        );
        if (children.length === 0) {
          return this.iterateTree(condition, node._PARENT, nodesVisited);
        }
        return this.iterateTree(condition, children[0], nodesVisited);
      }
    }
    const instances = window.Object.values(
      this._GAME.currentRoom._INSTANCES
    ).filter((nd) => !nodesVisited.has(nd));
    if (instances.length === 0) return { res: false, target: void 0 };
    return this.iterateTree(condition, instances[0], nodesVisited);
  };
  /**
   * 
   * @param {object} node 
   * @returns 
   */
  collideRules = (node) => {
    if (node === this || !(node instanceof _BoxCollider)) return false;
    if (node.layer !== this.layer && node.exceptions.includes(node))
      return false;
    return true;
  };
  // detecta si un objeto del tipo BoxCollider entra en el Area
  /**
   * 
   * @param {class} targetType 
   * @returns 
   */
  onArea = (targetType = Object) => {
    return this.iterateTree((node) => {
      if (!this.collideRules(node)) return false;
      if (!(node._PARENT instanceof targetType)) return false;
      return this.absolutePosition.x + this.size.x >= node.absolutePosition.x && this.absolutePosition.x <= node.absolutePosition.x + node.size.x && this.absolutePosition.y + this.size.y >= node.absolutePosition.y && this.absolutePosition.y <= node.absolutePosition.y + node.size.y;
    });
  };
  // detecta si un objeto del tipo BoxCollider entra en las coordenadas que recibe como parametro
  /**
   *
   * @param {Vector2} position
   * @param {class} targetType
   */
  onPlaceMeeting = (position, targetType = Object) => {
    return this.iterateTree((node) => {
      if (!this.collideRules(node)) return false;
      if (!(node._PARENT instanceof targetType)) return false;
      return position.x >= node.absolutePosition.x && position.x <= node.absolutePosition.x + node.size.x && position.y >= node.absolutePosition.y && position.y <= node.absolutePosition.y + node.size.y;
    });
  };
  // detecta si un objeto del tipo BoxCollider entra en las coordenadas mas el size
  // de el bojeto que ejecuta la funcion que recibe como parametro
  /**
   *
   * @param {Vector2} position
   * @param {class} targetType
   * @return {object}
   */
  onPlaceMeetingBox = (position, targetType = Object) => {
    return this.iterateTree((node) => {
      if (!this.collideRules(node)) return false;
      if (!(node._PARENT instanceof targetType)) return false;
      return position.x + this.size.x >= node.absolutePosition.x && position.x <= node.absolutePosition.x + node.size.x && position.y + this.size.y >= node.absolutePosition.y && position.y <= node.absolutePosition.y + node.size.y;
    });
  };
  // este metodo es muy similar a onPlaceMeetingBox solo que aqui el usuario puede
  // determinar el tamaño de el box con el que se hace la deteccion de la colision
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} x2
   * @param {number} y2
   * @param {class} targetType
   * @return {object}
   */
  onRectangleCollision = (x, y, x2, y2, targetType = Object) => {
    return this.iterateTree((node) => {
      if (!this.collideRules(node)) return false;
      if (!(node._PARENT instanceof targetType)) return false;
      return x + x2 >= node.absolutePosition.x && x <= node.absolutePosition.x + node.size.x && y + y2 >= node.absolutePosition.y && y <= node.absolutePosition.y + node.size.y;
    });
  };
};

// GameEngine/Camara.js
var Camara = class extends Object {
  #borderPosition = new Vector2(0, 0);
  #relativeSizeX = 0;
  #relativeSizeY = 0;
  #relativePaddingX = 0;
  #relativePaddingY = 0;
  /**
   * 
   * @param {object} GAME 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   */
  constructor(GAME, x, y, w, h) {
    super(GAME, x, y, w, h);
    this.absolutePosition = new Vector2(x, y);
    this.MODES = { Center: "Center", Borders: "Borders" };
    this.mode = this.MODES.Center;
    this.paddingX = 100;
    this.paddingY = 100;
    this.scaleX = 1;
    this.scaleY = 1;
    this._ROOM = void 0;
    this.LIMITS = { l: void 0, t: void 0, r: void 0, b: void 0 };
  }
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  setScale = (x, y) => {
    this.scaleX = x;
    this.scaleY = y;
  };
  /**
   * 
   * @param {number} x limit left
   * @param {number} y limit top
   * @param {number} x2 limit right
   * @param {number} y2 limit bottom
   */
  setCamaraLimits = (x, y, x2, y2) => {
    this.LIMITS.l = x;
    this.LIMITS.t = y;
    this.LIMITS.r = x2;
    this.LIMITS.b = y2;
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
      if (!this.LIMITS.l && !this.LIMITS.r && !this.LIMITS.t && !this.LIMITS.b) {
        return;
      }
      let normalizedSize = {
        x: this.scaleX > 1 ? (this.size.x - this.size.x / this.scaleX) / 2 : 0,
        y: this.scaleY > 1 ? (this.size.y - this.size.y / this.scaleY) / 2 : 0
      };
      if (this.absolutePosition.x + normalizedSize.x < this.LIMITS.l) {
        this._ROOM.positionContextRoom.x = this.LIMITS.l + normalizedSize.x;
      } else if (this.absolutePosition.x + this.size.x - normalizedSize.x > this.LIMITS.r) {
        this._ROOM.positionContextRoom.x = -(this.LIMITS.r - this.size.x + normalizedSize.x);
      }
      if (this.absolutePosition.y + normalizedSize.y < this.LIMITS.t) {
        this._ROOM.positionContextRoom.y = this.LIMITS.t + normalizedSize.y;
      } else if (this.absolutePosition.y + this.size.y - normalizedSize.y > this.LIMITS.b) {
        this._ROOM.positionContextRoom.y = -(this.LIMITS.b - this.size.y + normalizedSize.y);
      }
    }
  };
  // actualiza la posicion de el objeto segun la posicion del padre
  updatePosition = () => {
    if (this.mode === this.MODES.Center) {
      this.position = this._PARENT ? new Vector2(
        this._PARENT.position.x + this.position.x - this.size.x / 2 + this._PARENT.size.x / 2,
        this._PARENT.position.y + this.position.y - this.size.y / 2 + this._PARENT.size.y / 2
      ) : this.position;
    } else if (this.mode === this.MODES.Borders) {
      this.#relativeSizeX = Math.round(this.size.x / this.scaleX);
      this.#relativeSizeY = Math.round(this.size.y / this.scaleY);
      this.#relativePaddingX = Math.round(this.paddingX / this.scaleX);
      this.#relativePaddingY = Math.round(this.paddingY / this.scaleY);
      this.#borderPosition = new Vector2(
        -((this.#relativeSizeX - this.size.x) / 2) + this.position.x,
        -((this.#relativeSizeY - this.size.y) / 2) + this.position.y
      );
      const left = this.#borderPosition.x + this.#relativePaddingX;
      const right = left + this.#relativeSizeX - this.#relativePaddingX * 2 - this._PARENT.size.x;
      const top = this.#borderPosition.y + this.#relativePaddingY;
      const bottom = top + this.#relativeSizeY - this.#relativePaddingY * 2 - this._PARENT.size.y;
      if (this._PARENT.position.x < left) {
        this.position.x -= left - this._PARENT.position.x;
      }
      if (this._PARENT.position.x > right) {
        this.position.x += this._PARENT.position.x - right;
      }
      if (this._PARENT.position.y < top) {
        this.position.y -= top - this._PARENT.position.y;
      }
      if (this._PARENT.position.y > bottom) {
        this.position.y += this._PARENT.position.y - bottom;
      }
    }
    this.absolutePosition = this.position.Copy();
  };
  // reinicia la posicion del objeto para que no cresca exponecialmente al sumar la posicion del padre
  restartPosition = () => {
    if (this.mode === this.MODES.Center) {
      this.position = this._PARENT ? new Vector2(
        this.position.x - this._PARENT.position.x + this.size.x / 2 - this._PARENT.size.x / 2,
        this.position.y - this._PARENT.position.y + this.size.y / 2 - this._PARENT.size.y / 2
      ) : this.position;
    }
  };
};

// GameEngine/Time.js
var Time = class _Time {
  static time = (/* @__PURE__ */ new Date()).valueOf() / 1e3;
  static oldTime = 0;
  static deltaTime = 0;
  /**
   * 
   * @param {number} t 
   */
  static main = (t) => {
    _Time.time = t / 1e3;
    _Time.deltaTime = _Time.time - _Time.oldTime;
    _Time.oldTime = _Time.time;
  };
};

// GameEngine/Clock.js
var Clock = class {
  /**
   * 
   * @param {object} GAME 
   * @param {number} time 
   * @param {boolean} repeat 
   */
  constructor(GAME, time, repeat) {
    this._GAME = GAME;
    this.time = time;
    this.repeat = repeat;
    this.current = 0;
    this.runing = false;
    this.finished = false;
    this.oldSec = -1;
  }
  restart = () => {
    this.finished = false;
    this.current = 0;
    this.oldSec = -1;
  };
  reset = () => {
    this.finished = false;
    this.current = 0;
    this.oldSec = -1;
  };
  start = () => {
    this.runing = true;
  };
  pause = () => {
    this.runing = false;
  };
  /**
   * 
   * @param {requestCallback} callback 
   * @returns 
   */
  tick = (callback) => {
    if (!this.runing) return;
    let DT = (/* @__PURE__ */ new Date()).getMilliseconds();
    if (DT !== this.oldSec) {
      this.current += Time.deltaTime < 1 ? Time.deltaTime : 0;
      this.oldSec = DT;
    }
    if (this.current >= this.time) {
      if (callback) callback();
      if (this.repeat) this.restart();
      else {
        this.pause();
        this.finished = true;
      }
    }
  };
};

// GameEngine/Input.js
var Input = class _Input {
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
      y: e.offsetY * scaleY
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
    _Input._GAME = GAME;
    target.addEventListener("keydown", _Input._OnKeyDown.bind(this));
    target.addEventListener("keyup", _Input._OnKeyUp.bind(this));
    target.addEventListener("mousedown", _Input._OnMouseDown.bind(this));
    target.addEventListener("mouseup", _Input._OnMouseUp.bind(this));
    target.addEventListener("mousemove", _Input._OnMouseMove.bind(this));
    target.addEventListener("contextmenu", (e) => e.preventDefault());
    target.addEventListener("blur", (e) => {
      _Input.keydown.clear();
      _Input.keypress.clear();
      _Input.keyup.clear();
      _Input.mousedown.clear();
      _Input.mousepress.clear();
      _Input.mouseup.clear();
    });
  }
};
Input._GAME;
Input.keydown = /* @__PURE__ */ new Set();
Input.keypress = /* @__PURE__ */ new Set();
Input.keyup = /* @__PURE__ */ new Set();
Input.mousedown = /* @__PURE__ */ new Set();
Input.mousepress = /* @__PURE__ */ new Set();
Input.mouseup = /* @__PURE__ */ new Set();
Input.mouseCord = { x: 0, y: 0 };

// GameEngine/Game.js
var Game = class {
  #oldTime = 0;
  /**
   * 
   * @param {HTMLElement} game 
   * @param {HTMLCanvasElement} canvas 
   * @param {number} height 
   * @param {number} width 
   */
  constructor(game, canvas, width = void 0, height = void 0) {
    this.$ = game;
    this.canvas = canvas;
    this.viewport = new Vector2(
      width ? width : window.screen.width,
      height ? height : window.screen.height
    );
    this.resize();
    this.resize();
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.soundsStack = [];
    this.gamePaused = false;
    this.stopedGame = false;
    this.gameLoop = void 0;
    this.rooms = [];
    this.currentRoom = void 0;
    this.lastRoom = void 0;
    this.hoverUI = false;
    this.debug = true;
    this.cancelAnimationFrame = window.cancelAnimationFrame.bind(window) || window.mozCancelAnimationFrame.bind(window);
    this.requestAnimationFrame = window.requestAnimationFrame.bind(window) || window.mozRequestAnimationFrame.bind(window) || window.webkitRequestAnimationFrame.bind(window) || window.msRequestAnimationFrame.bind(window);
    Input.Init(this, this.canvas);
  }
  // ajusta los cambios de aspecto segun el tamaño de el display
  resize = () => {
    const ratio = this.viewport.x / this.viewport.y;
    const ratioX = this.viewport.x * ratio / 100;
    const ratioY = this.viewport.y * ratio / 100;
    if (this.$.getBoundingClientRect().right / ratioX > this.$.getBoundingClientRect().bottom / ratioY) {
      this.$.style.width = "auto";
      this.$.style.height = "100%";
    } else {
      this.$.style.width = "100%";
      this.$.style.height = "auto";
    }
    this.canvas.width = this.viewport.x;
    this.canvas.height = this.viewport.y;
    this.aspectRatio = new Vector2(ratioX, ratioY);
    this.$.style.aspectRatio = `${ratioX} / ${ratioY}`;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  };
  // #region ROOM
  /**
   * 
   * @returns {string}
   */
  getRoomNames = () => this.rooms.map((rm) => rm.name);
  /**
   * 
   * @returns {object}
   */
  getRoom = () => this.currentRoom;
  /**
   * 
   * @param {object} room 
   * @returns 
   */
  addRoom = (room) => this.rooms.push(room);
  /**
   * 
   * @param {string} roomName 
   * @param {boolean} save 
   */
  changeRoom = (roomName, save = false) => {
    this.hoverUI = false;
    let tempRoom = this.currentRoom;
    if (roomName === this.lastRoom?._NAME) {
      this.currentRoom = this.lastRoom;
      this.lastRoom = save ? tempRoom : void 0;
    } else {
      try {
        this.currentRoom = new (this.rooms.filter(
          (rm) => rm.name === roomName
        ))[0](this);
        this.lastRoom = save ? tempRoom : void 0;
      } catch (error) {
        console.log("Was an error to change room", error);
      }
    }
    this.resetContextGraphic();
  };
  // #endregion
  // #region GRAPHICS
  // hace un scale de los graficos
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  scaleContextGraphic = (x, y) => {
    this.ctx.scale(x, y);
  };
  // los parametros que resive esta funcion son las medidas de el area que se va a limpiar
  /**
   * 
   * @param {number} width 
   * @param {number} height 
   */
  clipContextGraphic = (width, height) => {
    this.ctx.save();
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.viewport.x, this.viewport.y);
    const centerX = this.viewport.x / 2 - this.currentRoom.sizeContextRoom.x / 2;
    const centerY = this.viewport.y / 2 - this.currentRoom.sizeContextRoom.y / 2;
    this.ctx.beginPath();
    this.ctx.rect(centerX, centerY, width, height);
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.clearRect(centerX, centerY, width, height);
  };
  // reinicia el ContextGraphic para que se muestre como normalmente lo haria
  resetContextGraphic = () => {
    this.ctx.restore();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
  // #endregion
  // #region SOUNDS
  /**
   * 
   * @param {string} url 
   * @returns {object}
   */
  findSound = (url) => {
    const splitedUrl = url.split("/");
    const formatUrl = `${splitedUrl[splitedUrl.length - 2]}/${splitedUrl[splitedUrl.length - 1]}`;
    return this.soundsStack.find((s) => s.src.includes(formatUrl));
  };
  /**
   * 
   * @param {string} url 
   * @param {number} volumen 
   * @param {number} speed 
   * @param {boolean} loop 
   */
  playSound = (url, volumen, speed = 1, loop = false) => {
    const found = this.findSound(url);
    if (found === void 0) {
      const temSound = new Audio(url);
      temSound.volume = volumen;
      temSound.loop = loop;
      temSound.playbackRate = speed;
      temSound.addEventListener("ended", () => this.deleteSound(temSound.src));
      temSound.play();
      this.soundsStack.push(temSound);
    } else if (found.paused) {
      found.play();
    } else {
      found.pause();
      found.currentTime = 0;
      found.play();
    }
  };
  /**
   * 
   * @param {string} url 
   * @returns 
   */
  pauseSound = (url) => {
    const found = this.findSound(url);
    if (!found) return;
    found.pause();
  };
  /**
   * 
   * @param {string} url 
   * @returns 
   */
  deleteSound = (url) => {
    const found = this.findSound(url);
    if (!found) return;
    this.soundsStack = this.soundsStack.filter((s) => s !== found);
  };
  // #endregion
  // #region SETUPGAME
  // esta funcion inicia el loop principal del motor
  startGame = () => {
    this.gameLoop = this.gameLoop === void 0 ? this.requestAnimationFrame(this.main) : this.gameLoop;
  };
  // detiene el motor por completo
  stopGame = () => {
    this.stopedGame = true;
    this.gameLoop = void 0;
  };
  // pausa el juego
  pauseGame = () => {
    this.gamePaused = true;
    this.soundsStack.forEach((s) => s.pause());
  };
  // des pausa el juego
  playGame = () => {
    this.gamePaused = false;
    this.soundsStack.forEach((s) => s.play());
  };
  // funcion principal del motor la cual renderiza el nivel y actualiza el delta time
  /**
   * 
   * @param {number} timestamp 
   */
  main = (timestamp) => {
    Time.main(timestamp);
    if (this.debug) {
      console.log(
        `%cGAME HOVER = ${this.hoverUI}, mouse:"X:${Input.mouseCord.x}, Y:${Input.mouseCord.y}", DeltaTime: ${Time.deltaTime}`,
        "color: #ffed9c; padding: 1px 4px;"
      );
    }
    if (this.currentRoom) this.currentRoom.main(this.ctx);
    if (!this.stopedGame) {
      this.gameLoop = this.requestAnimationFrame(this.main);
    } else {
      this.cancelAnimationFrame(this.gameLoop);
    }
  };
};

// GameEngine/KeyFrame.js
var KeyFrame = class {
  /**
   * 
   * @param {number} cutX 
   * @param {number} cutY 
   * @param {number} cutW 
   * @param {number} cutH 
   * @param {number} tileWidth 
   * @param {number} tileHeight 
   */
  constructor(cutX, cutY, cutW, cutH, tileWidth, tileHeight) {
    this.cutX = cutX;
    this.cutY = cutY;
    this.cutW = cutW;
    this.cutH = cutH;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }
};

// GameEngine/Room.js
var Room = class {
  /**
   * 
   * @param {object} GAME 
   */
  constructor(GAME) {
    this._GAME = GAME;
    this._NAME = this.constructor.name;
    this.positionContextRoom = new Vector2(0, 0);
    this.sizeContextRoom = new Vector2(
      this._GAME.viewport.x,
      this._GAME.viewport.y
    );
    this.scaleContextRoom = new Vector2(1, 1);
    this._INSTANCESUI = {};
    this._INSTANCES = {};
    this.backgrounds = {};
    this.tileMapLayer1 = void 0;
    this.tileMapLayer2 = void 0;
    this.tileMapLayer3 = void 0;
  }
  //#region INSTANCES
  // agregar un fondo a el nivel, el nivel puede tener varios fondos
  /**
   * 
   * @param {object} bg 
   * @param {string} name 
   */
  addBackground = (bg, name) => {
    bg._NAME = name;
    this.backgrounds[name] = bg;
  };
  // agrega un objeto al nivel
  /**
   * 
   * @param {object} inst 
   * @param {boolean} UI 
   * @param {string} name 
   */
  addInstance = (inst, UI2 = false, name) => {
    if (UI2 && !this._INSTANCESUI[name]) {
      inst._NAME = name;
      this._INSTANCESUI[name] = inst;
    } else if (UI2 && this._INSTANCESUI[name]) {
      throw new Error(`${name} does exist in UI`);
    }
    if (!UI2 && !this._INSTANCES[name]) {
      inst._NAME = name;
      this._INSTANCES[name] = inst;
    } else if (!UI2 && this._INSTANCES[name]) {
      throw new Error(`${name} does exist`);
    }
  };
  // elimina un objeto y sus hijos del nievel
  /**
   * 
   * @param {boolean} UI 
   * @param {string} name 
   */
  removeInstance = (UI2 = false, name) => {
    if (UI2) delete this._INSTANCESUI[name];
    else delete this._INSTANCES[name];
  };
  //#endregion
  //#region DRAW
  // dibuja los fondos y los tile maps
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw = (ctx) => {
    window.Object.values(this.backgrounds).forEach((bg) => bg.main(ctx));
    if (this.tileMapLayer1) this.tileMapLayer1.main(ctx);
    if (this.tileMapLayer2) this.tileMapLayer2.main(ctx);
  };
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawOver = (ctx) => {
    if (this.tileMapLayer3) this.tileMapLayer3.main(ctx);
  };
  //#endregion
  //#region RENDER
  // Renderiza los objetos esto quiere decir que llama a la funcion principal de cada uno
  /**
   * 
   * @param {object} obj 
   * @param {CanvasRenderingContext2D} ctx 
   */
  renderObejct = (obj, ctx) => {
    if (!this._GAME.gamePaused) {
      obj.main(ctx);
    } else {
      obj.updatePosition();
      obj.draw(ctx);
    }
    window.Object.values(obj._CHILDREN).forEach((child) => {
      this.renderObejct(child, ctx);
    });
    obj.restartPosition();
  };
  // Renderiza los objetos de la UI esto quiere decir que llama a la funcion principal de cada uno
  /**
   * 
   * @param {object} objUI 
   * @param {CanvasRenderingContext2D} ctx 
   */
  renderUI = (objUI, ctx) => {
    objUI.main(ctx);
    if (objUI.visible) {
      window.Object.values(objUI._CHILDREN).forEach((childUI) => {
        this.renderUI(childUI, ctx);
      });
    }
    objUI.restartPosition();
  };
  //#endregion
  // #region FINDS
  // esta funcion busca un objeto por el nombre
  /**
   * 
   * @param {string} name 
   * @param {boolean} UI 
   * @param {object} node 
   * @param {Set<object>} nodesVisited 
   * @returns {object}
   */
  findByName = (name, UI2 = false, node = void 0, nodesVisited = /* @__PURE__ */ new Set()) => {
    if (node) {
      if (!node?._PARENT) {
        if (UI2 && this._INSTANCESUI[name] === node) return node;
        else if (!UI2 && this._INSTANCES[name] === node) return node;
      } else if (node?._PARENT?._CHILDREN[name] === node) {
        return node;
      }
      nodesVisited.add(node);
      if (node._CHILDREN.length === 0) {
        return this.findByName(name, UI2, node._PARENT, nodesVisited);
      }
      if (node._CHILDREN.length !== 0) {
        const children = window.Object.values(node._CHILDREN).filter(
          (nd) => !nodesVisited.has(nd)
        );
        if (children.length === 0) {
          return this.findByName(name, UI2, node._PARENT, nodesVisited);
        }
        return this.findByName(name, UI2, children[0], nodesVisited);
      }
    }
    const instances = window.Object.values(
      UI2 ? this._INSTANCESUI : this._INSTANCES
    ).filter((nd) => !nodesVisited.has(nd));
    if (instances.length === 0) return void 0;
    return this.findByName(name, UI2, instances[0], nodesVisited);
  };
  // esta funcion busca un objeto por un query de clave y valor, el valor queda
  /**
   * 
   * @param {object[]} querys 
   * @param {boolean} UI 
   * @param {object} node 
   * @param {Set<object>} nodesVisited 
   * @returns {object}
   */
  findByQuery = (querys = [], UI2 = false, node = void 0, nodesVisited = /* @__PURE__ */ new Set()) => {
    if (node) {
      let coincidences = 0;
      querys.forEach((query) => {
        try {
          let key = node;
          query.key.split(".").forEach((k) => key = key[k] ? key[k] : void 0);
          if (query?.not) {
            if (key !== query.value) coincidences++;
          } else {
            if (key === query.value) coincidences++;
          }
        } catch (error) {
          if (this._GAME.debug) {
            console.log("Was an error whit the querys");
          }
        }
      });
      if (coincidences === querys.length) return node;
      nodesVisited.add(node);
      if (node._CHILDREN.length === 0) {
        return this.findByQuery(querys, UI2, node._PARENT, nodesVisited);
      }
      if (node._CHILDREN.length !== 0) {
        const children = window.Object.values(node._CHILDREN).filter(
          (nd) => !nodesVisited.has(nd)
        );
        if (children.length === 0) {
          return this.findByQuery(querys, UI2, node._PARENT, nodesVisited);
        }
        return this.findByQuery(querys, UI2, children[0], nodesVisited);
      }
    }
    const instances = window.Object.values(
      UI2 ? this._INSTANCESUI : this._INSTANCES
    ).filter((nd) => !nodesVisited.has(nd));
    if (instances.length === 0) return void 0;
    return this.findByQuery(querys, UI2, instances[0], nodesVisited);
  };
  // #endregion
  //#region MAIN
  // renderiza los objetos hijos de este nivel
  // no modificar esta funcion ya que es por medio de esta que el motor renderiza renderiza el nivel
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  main = (ctx) => {
    this._GAME.clipContextGraphic(
      this.sizeContextRoom.x,
      this.sizeContextRoom.y
    );
    this._GAME.scaleContextGraphic(
      this.scaleContextRoom.x,
      this.scaleContextRoom.y
    );
    const centerX = this.positionContextRoom.x + (this._GAME.viewport.x / 2 - this.sizeContextRoom.x / 2 * this.scaleContextRoom.x) / this.scaleContextRoom.x;
    const centerY = this.positionContextRoom.y + (this._GAME.viewport.y / 2 - this.sizeContextRoom.y / 2 * this.scaleContextRoom.y) / this.scaleContextRoom.y;
    ctx.translate(centerX, centerY);
    this.draw(ctx);
    window.Object.values(this._INSTANCES).forEach((instance) => {
      this.renderObejct(instance, ctx);
    });
    this.drawOver(ctx);
    this._GAME.resetContextGraphic();
    window.Object.values(this._INSTANCESUI).forEach((instanceUI) => {
      this.renderUI(instanceUI, ctx);
    });
  };
  //#endregion
};

// GameEngine/Sprite.js
var Sprite = class extends Object {
  /**
   * 
   * @param {object} GAME 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   * @param {string} url 
   */
  constructor(GAME, x, y, w, h, url) {
    super(GAME, x, y, w, h);
    this.url = url;
    this._IMAGE = new Image(w, h);
    this._IMAGE.src = url;
    this.canDraw = false;
    this._IMAGE.onload = () => {
      this.canDraw = true;
    };
    this.flipX = false;
    this.flipY = false;
    this.cutX = void 0;
    this.cutY = void 0;
    this.cutW = void 0;
    this.cutH = void 0;
    this.tileWidth = void 0;
    this.tileHeight = void 0;
    this.animation = [];
    this.frame = 0;
    this.frames = -1;
    this.time = 0;
    this.repeat = true;
    this.clock = new Clock(GAME, this.time, this.repeat);
  }
  onEnd = () => {
  };
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @returns 
   */
  draw = (ctx) => {
    if (!this.canDraw) return;
    const FX = this.flipX ? -1 : 1;
    const FY = this.flipY ? -1 : 1;
    ctx.save();
    ctx.scale(FX, FY);
    if (this.cutX !== void 0 && this.cutY !== void 0 && this.cutW !== void 0 && this.cutH !== void 0 && this.tileWidth !== void 0 && this.tileHeight !== void 0) {
      ctx.drawImage(
        this._IMAGE,
        // image
        this.cutX,
        // cut x
        this.cutY,
        // cut y
        this.cutW,
        // cut w
        this.cutH,
        // cut h
        (this.position.x + (FX === -1 ? this.tileWidth : 0)) * FX,
        (this.position.y + (FY === -1 ? this.tileHeight : 0)) * FY,
        this.tileWidth,
        // sprite w
        this.tileHeight
        // sprite h
      );
    } else {
      ctx.drawImage(
        this._IMAGE,
        (this.position.x + (FX === -1 ? this.size.x : 0)) * FX,
        (this.position.y + (FY === -1 ? this.size.y : 0)) * FY,
        this.size.x,
        this.size.y
      );
    }
    ctx.restore();
  };
  play = () => {
    if (!this.clock) return;
    this.clock.start();
  };
  stop = () => {
    if (!this.clock) return;
    this.clock.pause();
  };
  /**
   * 
   * @param {number} cutX 
   * @param {number} cutY 
   * @param {number} cutW 
   * @param {number} cutH 
   * @param {number} tileWidth 
   * @param {number} tileHeight 
   */
  cutSprite = (cutX, cutY, cutW, cutH, tileWidth, tileHeight) => {
    this.cutX = cutX;
    this.cutY = cutY;
    this.cutW = cutW;
    this.cutH = cutH;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  };
  /**
   * 
   * @param {object[]} animation KeyFrame list
   * @param {number} time 
   * @param {boolean} repeat 
   */
  setAnimation = (animation, time = 0.2, repeat = true) => {
    this.stop();
    this.clock.oldSec = -1;
    this.clock.current = 0;
    this.clock.time = time;
    this.clock.repeat = repeat;
    this.frame = 0;
    this.frames = animation.length - 1;
    this.animation = animation;
    this.time = time;
    this.repeat = repeat;
  };
  /**
   * 
   * @param {string} url 
   */
  changeSprite = (url) => {
    this.url = url;
    this._IMAGE = new Image(this.size.x, this.size.y);
    this._IMAGE.src = url;
    this.canDraw = false;
    this._IMAGE.onload = () => {
      this.canDraw = true;
    };
  };
  /**
   * 
   * @param {object[]} animation KeyFrame list
   * @param {number} time 
   * @param {boolean} repeat 
   */
  changeAnimation = (animation, time = 0.2, repeat = true) => {
    this.time = time;
    this.frame = 0;
    this.frames = animation.length - 1;
    this.animation = animation;
    this.repeat = repeat;
    this.stop();
    this.clock = new Clock(this._GAME, time, true);
    this.play();
  };
  steps = () => {
    if (!this.clock) return;
    this.clock.tick(() => {
      if (this.repeat) {
        this.frame = this.frame >= this.frames ? 0 : this.frame + 1;
      } else {
        this.frame = this.frame < this.frames ? this.frame + 1 : this.frame;
      }
      if (!this.repeat && this.frame >= this.frames) {
        this.stop();
        this.onEnd();
      }
    });
    if (this.frames === -1) return;
    this.cutX = this.animation[this.frame].cutX;
    this.cutY = this.animation[this.frame].cutY;
    this.cutW = this.animation[this.frame].cutW;
    this.cutH = this.animation[this.frame].cutH;
    this.tileWidth = this.animation[this.frame].tileWidth;
    this.tileHeight = this.animation[this.frame].tileHeight;
  };
};

// GameEngine/Tilemap.js
var Tilemap = class extends Object {
  /**
   * 
   * @param {object} GAME 
   * @param {string} url 
   * @param {number} width 
   * @param {number} height 
   * @param {number} tileWidth 
   * @param {number} tileHeight 
   */
  constructor(GAME, url = void 0, width, height, tileWidth, tileHeight) {
    super(GAME, 0, 0, width, height);
    this._IMAGE = new Image();
    this._IMAGE.src = url;
    this.canDraw = false;
    this._IMAGE.onload = () => {
      this.canDraw = true;
    };
    this.tiles = [];
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileImage = void 0;
  }
  // * x -> posicion en el grid
  // * y -> posicion en le grid
  // * row -> row de recorte de la imagen
  // * col -> col de recorte de la imagen
  /**
   * 
   * @param {number} x Grid column
   * @param {number} y Grid row
   * @param {number} row Image row
   * @param {number} col Image column
   * @param {number} cutW Image cut widht
   * @param {number} cutH Image cut height
   */
  addTile = (x, y, row, col, cutW, cutH) => {
    this.tiles.push({
      x,
      y,
      row,
      col,
      cutW,
      cutH
    });
  };
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @returns 
   */
  draw = (ctx) => {
    if (!this.canDraw) return;
    if (this.tileImage === void 0) {
      let canvasTemp = document.createElement("canvas");
      canvasTemp.setAttribute("width", this.size.x);
      canvasTemp.setAttribute("height", this.size.y);
      let ctxTemp = canvasTemp.getContext("2d");
      ctxTemp.imageSmoothingEnabled = false;
      this.tileImage = new Image();
      this.tiles.forEach((tile) => {
        ctxTemp.drawImage(
          this._IMAGE,
          // image
          tile.row * tile.cutW,
          // cut x
          tile.col * tile.cutH,
          // cut y
          tile.cutW,
          // cut w
          tile.cutH,
          // cut h
          tile.x * this.tileWidth,
          // image x
          tile.y * this.tileHeight,
          // image y
          this.tileWidth,
          // image w
          this.tileHeight
          // image h
        );
      });
      this.tileImage.src = canvasTemp.toDataURL();
    } else {
      ctx.drawImage(
        this.tileImage,
        // image
        this.position.x,
        // image x
        this.position.y
        // image y
      );
    }
  };
};

// GameEngine/UI.js
var UI = class extends Object {
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
  draw = (ctx) => {
  };
  checkMousePosition = () => {
    if (this.constructor.name === "UI" || this.container) return;
    if (Input.GetMouseCords().x >= this.position.x && Input.GetMouseCords().x <= this.position.x + this.size.x && Input.GetMouseCords().y >= this.position.y && Input.GetMouseCords().y <= this.position.y + this.size.y) {
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
  onBlur = () => {
  };
  onClick = () => {
  };
  onFocus = () => {
  };
  onMouseDown = () => {
  };
  onMouseUp = () => {
  };
  onMouseMove = () => {
  };
  onMouseHover = () => {
  };
  onMouseLeave = () => {
  };
  onKeyDown = () => {
  };
  onKeyUp = () => {
  };
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
      this.mouseOn = false;
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
  steps = () => {
  };
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  main = (ctx) => {
    if (!this.#created) {
      this.onCreate();
      this.#created = true;
    }
    if (this.visible) {
      this.updatePosition();
      this.events();
      this.steps();
      this.draw(ctx);
    }
  };
};

// GameEngine/UI.Button.js
var UIButton = class extends UI {
  /**
   * 
   * @param {object} GAME 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   * @param {string} text 
   */
  constructor(GAME, x, y, w, h, text) {
    super(GAME, x, y, w, h);
    this.container = false;
    this.text = text;
    this.font = "16px sans-serif";
    this.backgroundColor = "#aaa";
    this.color = "#222";
    this.fill = true;
    this.border = false;
    this.borderWeight = 1;
    this.borderColor = "#000";
    this.align = "center";
    this.textMetrics = new Vector2(0, 0);
    this.backgroundColorHover = "#0ea5e9";
    this.colorHover = "#fff";
    this.borderColorHover = "#000";
    this.backgroundColorPressed = "#0089C6";
    this.colorPressed = "#6BC8F2";
    this.borderColorPressed = "#000";
  }
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @returns 
   */
  drawBody = (ctx) => {
    if (this.hover && !this.pressed) {
      ctx.fillStyle = this.backgroundColorHover;
    } else if (this.hover && this.pressed) {
      ctx.fillStyle = this.backgroundColorPressed;
    } else {
      ctx.fillStyle = this.backgroundColor;
    }
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    if (!this.border) return;
    if (this.hover && !this.pressed) {
      ctx.strokeStyle = this.borderColorHover;
    } else if (this.hover && this.pressed) {
      ctx.strokeStyle = this.borderColorPressed;
    } else {
      ctx.strokeStyle = this.borderColor;
    }
    ctx.lineWidth = this.borderWeight;
    ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
  };
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.size.x, this.size.y);
    ctx.clip();
    ctx.font = this.font;
    this.textMetrics.x = Math.ceil(ctx.measureText(this.text).width);
    this.textMetrics.y = Math.ceil(ctx.measureText(this.text).hangingBaseline);
    this.drawBody(ctx);
    if (this.hover && !this.pressed) {
      ctx.fillStyle = this.colorHover;
      ctx.strokeStyle = this.colorHover;
    } else if (this.hover && this.pressed) {
      ctx.fillStyle = this.colorPressed;
      ctx.strokeStyle = this.colorPressed;
    } else {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
    }
    let textAlign = this.align === "center" ? this.size.x / 2 - this.textMetrics.x / 2 : this.align === "right" ? this.size.x - this.textMetrics.x : 0;
    if (this.fill) {
      ctx.fillText(
        this.text,
        this.position.x + textAlign,
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2
      );
    } else {
      ctx.strokeText(
        this.text,
        this.position.x + textAlign,
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2
      );
    }
    ctx.restore();
  };
};

// GameEngine/UI.Input.js
var UIInput = class extends UI {
  /**
   * 
   * @param {object} GAME 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   * @param {string} text 
   * @param {string} placeholder 
   */
  constructor(GAME, x, y, w, h, text = "", placeholder = "placeholder") {
    super(GAME, x, y, w, h);
    this.container = false;
    this.text = text;
    this.maxTextLength = 50;
    this.placeholder = placeholder;
    this.font = "16px sans-serif";
    this.placeholderColor = "#555";
    this.backgroundColor = "#aaa";
    this.colorPointer = "#000";
    this.pointer = 0;
    this.color = "#222";
    this.fill = true;
    this.border = false;
    this.activeBorderColor = "#0ea5e9";
    this.textMetrics = new Vector2(0, 0);
    this.backgroundColorHover = "#0ea5e9";
    this.colorHover = "#fff";
  }
  onKeyDown = () => {
    let letters = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM\xF1\xD1,.-_;:[]{}''*+^\xA8\xB0!|#$%&/()=?\xA1\xBF ".split(
      ""
    );
    if (Input.GetKeyDown("ArrowLeft")) {
      this.pointer += this.pointer > 0 ? -1 : 0;
    }
    if (Input.GetKeyDown("ArrowRight")) {
      this.pointer += this.pointer < this.text.length ? 1 : 0;
    }
    if (Input.GetKeyDown("End")) {
      this.pointer = this.text.length;
    }
    if (Input.GetKeyDown("Home")) {
      this.pointer = 0;
    }
    if (Input.GetKeyDown("Backspace")) {
      this.text = this.text.split("").filter((x, i) => i === this.pointer - 1 ? "" : x).join("");
      this.pointer += this.pointer > 0 ? -1 : 0;
    }
    letters.forEach((lett) => {
      if (this.text.length >= this.maxTextLength) return;
      if (Input.GetKeyDown(lett)) {
        if (this.text === "") {
          this.text += lett;
          this.pointer++;
        } else if (this.pointer === 0) {
          this.text = lett + this.text;
          this.pointer++;
        } else {
          this.text = this.text.split("").map((x, i) => i === this.pointer - 1 ? x + lett : x).join("");
          this.pointer++;
        }
      }
    });
  };
  onBlur = () => {
    this.pointer = 0;
  };
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.size.x, this.size.y);
    ctx.clip();
    ctx.font = this.font;
    this.textMetrics.x = Math.ceil(ctx.measureText(this.text).width);
    this.textMetrics.y = Math.ceil(ctx.measureText(this.text).hangingBaseline);
    ctx.fillStyle = this.hover ? this.backgroundColorHover : this.backgroundColor;
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    let overflow = 0;
    if (ctx.measureText(this.text.substr(0, this.pointer)).width > this.size.x) {
      overflow = ctx.measureText(this.text.substr(0, this.pointer)).width - this.size.x;
    }
    if (this.active) {
      ctx.strokeStyle = this.activeBorderColor;
      ctx.strokeRect(
        this.position.x + 1,
        this.position.y + 1,
        this.size.x - 2,
        this.size.y - 2
      );
      ctx.fillStyle = this.colorPointer;
      ctx.fillRect(
        this.position.x + ctx.measureText(this.text.substr(0, this.pointer)).width - overflow,
        this.position.y + this.size.y / 6,
        2,
        this.size.y - this.size.y / 3
      );
    }
    if (this.text.length > 0) {
      ctx.fillStyle = this.hover ? this.colorHover : this.color;
    } else {
      ctx.fillStyle = this.placeholderColor;
    }
    ctx.strokeStyle = this.hover ? this.colorHover : this.color;
    if (this.fill) {
      ctx.fillText(
        this.text.length === 0 ? this.placeholder : this.text,
        this.position.x - overflow,
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2
      );
    } else {
      ctx.strokeText(
        this.text.length === 0 ? this.placeholder : this.text,
        this.position.x - overflow,
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2
      );
    }
    ctx.restore();
  };
};

// GameEngine/UI.Label.js
var UILabel = class extends UI {
  /**
   * 
   * @param {object} game 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   * @param {string} text 
   */
  constructor(game, x, y, w, h, text) {
    super(game, x, y, w, h);
    this.container = false;
    this.text = text;
    this.font = "16px sans-serif";
    this.backgroundColor = "#0005";
    this.color = "#000";
    this.fill = true;
    this.border = false;
    this.align = "left";
    this.textMetrics = new Vector2(0, 0);
  }
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.size.x, this.size.y);
    ctx.clip();
    ctx.font = this.font;
    this.textMetrics.x = Math.ceil(ctx.measureText(this.text).width);
    this.textMetrics.y = Math.ceil(
      ctx.measureText(this.text).hangingBaseline
    );
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    let textAlign = this.align === "center" ? this.size.x / 2 - this.textMetrics.x / 2 : this.align === "right" ? this.size.x - this.textMetrics.x : 0;
    if (this.fill) {
      ctx.fillText(
        this.text,
        this.position.x + textAlign,
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2,
        this.size.x
      );
    } else {
      ctx.strokeText(
        this.text,
        this.position.x + textAlign,
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2,
        this.size.x
      );
    }
    ctx.restore();
  };
};
export {
  Background,
  BoxCollider,
  Camara,
  Clock,
  Game,
  Input,
  KeyFrame,
  Object,
  Room,
  Sprite,
  Tilemap,
  Time,
  UI,
  UIButton,
  UIInput,
  UILabel,
  Vector2
};
