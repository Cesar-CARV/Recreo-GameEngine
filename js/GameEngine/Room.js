// import { SpriteAnimator } from "./Animator.js";
import Vector2 from "./Vector2.js";

export default class Room {
    constructor(GAME, w, h, name) {
        this._GAME = GAME;
        this.w = w;
        this.h = h;
        this.name = name;
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
        console.log(this._INSTANCES[name]);
        if (UI) delete this._INSTANCESUI[name];
        else delete this._INSTANCES[name];
    };

    // dibuja los fondos y los tile maps
    draw = (ctx) => {
        this.backgrounds.forEach((bg) => bg.main(ctx));
        if (this.tileMapLayer1) this.tileMapLayer1.main(ctx);
        if (this.tileMapLayer2) this.tileMapLayer2.main(ctx);
        if (this.tileMapLayer3) this.tileMapLayer3.main(ctx);
    };

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

    // #region FINDS

    // ESTAS FUNCIONES QUEDAN PENDIENTES A MODIFICACION
    // RESIVIRAN DOS PARAMETROS, LA LISTA A BUSCAR Y EL SELECTOR

    // esta funcion busca un objeto por el nombre
    findByName = (
        name, UI = false, node = undefined, nodesVisited = new Set()
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
                    return this.findByName(
                        name,
                        UI,
                        node._PARENT,
                        nodesVisited
                    );
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
    // findByQuery = (type, querys = []) => {
    //     return this._INSTANCES.filter(inst => {
    //         let coincidences = 0;

    //         querys.forEach(query => coincidences = inst[query.key] === query.value ? + 1 : coincidences);

    //         if (coincidences === querys.length && type === inst.constructor.name) return inst;
    //     });
    // }

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

        this._GAME.resetContextGraphic();

        // renderizar los objetos que pertenecen a la interfaz grafica
        window.Object.values(this._INSTANCESUI).forEach((instanceUI) => {
            instanceUI.main(ctx);
        });
    };
}
