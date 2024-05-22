import Vector2 from "./Vector2.js";

export default class Room {
  constructor(GAME, w, h) {
    this._GAME = GAME;
    this._NAME = this.constructor.name;
    this.w = w;
    this.h = h;
    this.positionContextRoom = new Vector2(0, 0);
    this.sizeContextRoom = new Vector2(this._GAME.w, this._GAME.h);
    this.scaleContextRoom = new Vector2(1, 1);
    this._INSTANCESUI = {};
    this._INSTANCES = {};
    this.backgrounds = [];
    this.tileMapLayer1 = undefined;
    this.tileMapLayer2 = undefined;
    this.tileMapLayer3 = undefined;
  }

  // agregar un fondo a el nivel, el nivel puede tener varios fondos
  addBackground = (bg) => {
    this.backgrounds.push(bg);
  };

  // agrega un objeto al nivel
  addInstance = (inst, UI = false, name) => {
    if (UI && !this._INSTANCESUI[name]) {
      inst._NAME = name;
      this._INSTANCESUI[name] = inst;
    } else if (UI && this._INSTANCESUI[name]) {
      throw new Error(`${name} does exist in UI`);
    }

    if (!UI && !this._INSTANCES[name]) {
      inst._NAME = name;
      this._INSTANCES[name] = inst;
    } else if (!UI && this._INSTANCES[name]) {
      throw new Error(`${name} does exist`);
    }
  };

  // elimina un objeto y sus hijos del nievel
  removeInstance = (UI = false, name) => {
    if (UI) delete this._INSTANCESUI[name];
    else delete this._INSTANCES[name];
  };

  // dibuja los fondos y los tile maps
  draw = (ctx) => {
    this.backgrounds.forEach((bg) => bg.main(ctx));
    if (this.tileMapLayer1) this.tileMapLayer1.main(ctx);
    if (this.tileMapLayer2) this.tileMapLayer2.main(ctx);
  };

  drawOver = (ctx) => {
    if (this.tileMapLayer3) this.tileMapLayer3.main(ctx);
  }

  // Renderiza los objetos esto quiere decir que llama a la funcion principal de cada uno
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
  renderUI = (objUI, ctx) => {
    // TODO: detectar si el objetoUI es visible, si no lo es que no se dibujen sus hijos
    
    // TODO: hacer que el padre se dibuje primero y luego los hijos para que el padre no se 
    // TODO: superponga a los hijos
    
    objUI.main(ctx);
    
    if (objUI.visible){
      window.Object.values(objUI._CHILDREN).forEach((childUI) => {
        this.renderUI(childUI, ctx);
      });
    }
    
    objUI.restartPosition();
  };

  // #region FINDS
  // esta funcion busca un objeto por el nombre
  findByName = (
    name,
    UI = false,
    node = undefined,
    nodesVisited = new Set()
  ) => {
    if (node) {
      // comprueba si el nodo es igual el nodo es el que se busca
      if (!node?._PARENT) {
        if (UI && this._INSTANCESUI[name] === node) return node;
        else if (!UI && this._INSTANCES[name] === node) return node;
      } else if (node?._PARENT?._CHILDREN[name] === node) {
        return node;
      }

      // si el nodo no es el que se busca se agrega al set
      nodesVisited.add(node);

      // comprueba si no tiene hijos, si no tiene se retorna a el padre
      if (node._CHILDREN.length === 0) {
        return this.findByName(name, UI, node._PARENT, nodesVisited);
      }

      // comprueba si tiene hijos, si es asi valida que los hijos no se encuentren el el set
      // y de ser asi retornara la funcion con el parametro de nodo como el primer hijo
      if (node._CHILDREN.length !== 0) {
        const children = window.Object.values(node._CHILDREN).filter(
          (nd) => !nodesVisited.has(nd)
        );

        if (children.length === 0) {
          return this.findByName(name, UI, node._PARENT, nodesVisited);
        }

        return this.findByName(name, UI, children[0], nodesVisited);
      }
    }

    // si no el nodo no existe se filtran los nodos hijos de el room
    // y se busca en el primer indice
    const instances = window.Object.values(
      UI ? this._INSTANCESUI : this._INSTANCES
    ).filter((nd) => !nodesVisited.has(nd));

    if (instances.length === 0) return undefined;
    return this.findByName(name, UI, instances[0], nodesVisited);
  };

  // esta funcion busca un objeto por un query de clave y valor, el valor queda
  findByQuery = (
    querys = [],
    UI = false,
    node = undefined,
    nodesVisited = new Set()
  ) => {
    if (node) {
      // comprueba si el nodo es igual el nodo es el que se busca
      let coincidences = 0;
      querys.forEach((query) => {
        // si el query incluye un parametro not hace la comprovacion inversa
        try {
          // se obtiene el selector
          let key = node;
          query.key
            .split(".")
            .forEach((k) => (key = key[k] ? key[k] : undefined));
          //  se hace la validacion segun si es negacion o no
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

      // si el nodo no es el que se busca se agrega al set
      nodesVisited.add(node);

      // comprueba si no tiene hijos, si no tiene se retorna a el padre
      if (node._CHILDREN.length === 0) {
        return this.findByQuery(querys, UI, node._PARENT, nodesVisited);
      }

      // comprueba si tiene hijos, si es asi valida que los hijos no se encuentren el el set
      // y de ser asi retornara la funcion con el parametro de nodo como el primer hijo
      if (node._CHILDREN.length !== 0) {
        const children = window.Object.values(node._CHILDREN).filter(
          (nd) => !nodesVisited.has(nd)
        );

        if (children.length === 0) {
          return this.findByQuery(querys, UI, node._PARENT, nodesVisited);
        }

        return this.findByQuery(querys, UI, children[0], nodesVisited);
      }
    }

    // si no el nodo no existe se filtran los nodos hijos de el room
    // y se busca en el primer indice
    const instances = window.Object.values(
      UI ? this._INSTANCESUI : this._INSTANCES
    ).filter((nd) => !nodesVisited.has(nd));

    if (instances.length === 0) return undefined;
    return this.findByQuery(querys, UI, instances[0], nodesVisited);
  };

  // #endregion

  // renderiza los objetos hijos de este nivel
  // no modificar esta funcion ya que es por medio de esta que el motor renderiza renderiza el nivel
  main = (ctx) => {
    // clip context
    this._GAME.clipContextGraphic(
      this.sizeContextRoom.x,
      this.sizeContextRoom.y
    );

    // escalar context
    this._GAME.scaleContextGraphic(
      this.scaleContextRoom.x,
      this.scaleContextRoom.y
    );

    // mover context
    const centerX =
      this.positionContextRoom.x +
      (this._GAME.w / 2 -
        (this.sizeContextRoom.x / 2) * this.scaleContextRoom.x) /
        this.scaleContextRoom.x;
    const centerY =
      this.positionContextRoom.y +
      (this._GAME.h / 2 -
        (this.sizeContextRoom.y / 2) * this.scaleContextRoom.y) /
        this.scaleContextRoom.y;

    ctx.translate(centerX, centerY);

    // draw tiles and background
    this.draw(ctx);

    // renderizar objetos
    window.Object.values(this._INSTANCES).forEach((instance) => {
      this.renderObejct(instance, ctx);
    });

    // dibujar el los elementos de el nivel que estaran por encima de los demas
    this.drawOver(ctx);

    this._GAME.resetContextGraphic();

    // renderizar los objetos que pertenecen a la interfaz grafica
    window.Object.values(this._INSTANCESUI).forEach((instanceUI) => {
      this.renderUI(instanceUI, ctx);
      // instanceUI.main(ctx);
    });
  };
}
