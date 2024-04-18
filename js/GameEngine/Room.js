// import { SpriteAnimator } from "./Animator.js";
import Vector2 from "./Vector2.js";

export default class Room {
    constructor(GAME, w, h, name) {
        this._GAME = GAME;
        this.w = w;
        this.h = h;
        this.name = name;
        this.positionContextRoom = new Vector2(0, 0);
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
            this._INSTANCESUI[name] = inst;
        } else if (UI && this._INSTANCESUI[name]) {
            throw new Error(`${name} does exist in UI`);
        }

        if (!UI && !this._INSTANCES[name]) {
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
        if (!this._GAME.pauseGame) {
            obj.main(ctx);
        } else {
            obj.updatePosition();
            obj.draw(ctx);
            // obj.restartPosition(); // se comento esta linea para solucionar un error de seguimiento al poner pause
        }

        window.Object.values(obj._CHILDREN).forEach((child) => {
            this.renderObejct(child, ctx);
        });

        obj.restartPosition();
    };

    // #region FINDS

    // ESTAS FUNCIONES QUEDAN PENDIENTES A MODIFICACION
    // RESIVIRAN DOS PARAMETROS, LA LISTA A BUSCAR Y EL SELECTOR

    // esta funcion busca un objeto por el tipo de dato, el valor queda
    // pendiente si sera un tipo o un string ejemplo: obj instanceof UI
    findByType = (type) => {
        // PARA PODER REALIZAR LA BUSQUEDA DE UNA MANERA EFICIETNE A LO LARGO DE TODO EL ARBOL BUSCAR
        // UN ALGORITMO DE BUSQUEDA DE GRAFOS / ARBOLES
        //return this._INSTANCES.filter(inst => inst.constructor.name === type);
        
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
        this._GAME.clipContextGraphic(this.w, this.h);

        // mover context
        ctx.translate(this.positionContextRoom.x, this.positionContextRoom.y);

        // renderizar objetos
        window.Object.values(this._INSTANCES).forEach((instance) => {
            this.renderObejct(instance, ctx);
        });
        this.draw(ctx);

        this._GAME.resetContextGraphic();

        // renderizar los objetos que pertenecen a la interfaz grafica
        window.Object.values(this._INSTANCESUI).forEach((instanceUI) => {
            instanceUI.main(ctx);
        });
    };
}
