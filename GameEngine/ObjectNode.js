import Vector2 from "./Vector2.js";

export default class ObjectNode {
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
    this._NAME = undefined;
    this._PARENT = undefined; // padre directo
    this._CHILDREN = {}; // hijos del objeto
    this.position = new Vector2(x, y); // posicion del objeto, nota: la posicion es relativa a el padre
    this.size = new Vector2(w, h);
  }

  // al crear 
  onCreate = () => {

  }

  // eliminarse a si mismo
  kamikaze = (callback = ()=> {}) => {
    if (callback) callback();

    if (this?._PARENT?._CHILDREN) {
      this._PARENT._CHILDREN = delete this._PARENT._CHILDREN[this._NAME];
    }
    else {
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
    this.position = this._PARENT
      ? new Vector2(this._PARENT.position.x + x, this._PARENT.position.y + y)
      : new Vector2(x, y);
  };

  // actualiza la posicion de el objeto segun la posicion del padre
  updatePosition = () => {
    this.position = this._PARENT
      ? new Vector2(
          this._PARENT.position.x + this.position.x,
          this._PARENT.position.y + this.position.y
        )
      : this.position;
  };

  // reinicia la posicion del objeto para que no cresca exponecialmente al sumar la posicion del padre
  restartPosition = () => {
    this.position = this._PARENT
      ? new Vector2(
          this.position.x - this._PARENT.position.x,
          this.position.y - this._PARENT.position.y
        )
      : this.position;
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

    // this._CHILDREN.push({ name: name, obj: obj });
    // obj._PARENT = this;
  };

  // retorna un hijo segun el nombre
  /**
   * 
   * @param {string} name 
   * @returns 
   */
  getChild = (name) => {
    return this._CHILDREN[name];
    // const child = this._CHILDREN.filter((ch) => ch.name === name)[0];
    // return child ? child.obj : child;
  };

  // elimina un hijo segun el nombre
  /**
   * 
   * @param {string} name 
   * @returns 
   */
  delteChild = (name) => {
    return delete this._CHILDREN[name];
    // this._CHILDREN = this._CHILDREN.filter((ch) => ch.name !== name);
  };

  // dentro de esta funcion se podra utilizar el ContextGraphic del canvas para dibujar cualquier cosa
  // como recomendacion solo utilizarla para dibujar ya que si se afecta al ContextGraphic de cierto modo
  // esto podria afectar a el resto de el motor
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw = (ctx) => {};

  // en este evento es donde se programaran las acciones del objeto,
  // esta es la funcion un bucle del objeto
  steps = () => {};

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
    // this.restartPosition(); // esta linea se elemino para solucionar el bug de seguimiento de los padres
  };
}
