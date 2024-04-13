import Vector2 from "./Vector2.js";

export default class Room {
    constructor(GAME, w, h, name) {
        this._GAME = GAME;
        this.w = w;
        this.h = h;
        this.name = name;
        this.positionContextRoom = new Vector2(0, 0);
        this._INSTANCESUI = [];
        this._INSTANCES = [];
        this.backgrounds = [];
        this.tileMapLayer1 = undefined;
        this.tileMapLayer2 = undefined;
        this.tileMapLayer3 = undefined;
    }

    // agregar un fondo a el nivel, el nivel puede tener varios fondos
    addBackground = (bg) => {
        this.backgrounds.push(bg);
    };

    // // agrega una camara al nive, por el momento solo puede tener una camara cada nivel
    // setCamara = (camara) => {
    //     camara.room = this;
    //     this.camara = camara;
    // };

    // agrega un objeto al nivel
    addInstance = (inst, UI = false) => {
        if (UI) this._INSTANCESUI.push(inst);
        else this._INSTANCES.push(inst);
    };

    // elimina un objeto y sus hijos del nievel
    removeInstance = (inst) => {
        if (UI) this._INSTANCESUI = this._INSTANCESUI.filter((x) => x !== inst);
        else this._INSTANCES = this._INSTANCES.filter((x) => x !== inst);
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

        obj._CHILDREN.forEach((child) => {
            this.renderObejct(child.obj, ctx);
        });

        obj.restartPosition();
    };

    // renderiza los objetos hijos de este nivel
    // no modificar esta funcion ya que es por medio de esta que el motor renderiza renderiza el nivel
    main = (ctx) => {
        // esta parte de clip deberia de ser dinamica dependiendo si hay una camara o no
        // la forma en la que se podria hacer esto es que compruebe si hay una camara asignada
        // y pasarle como parametros las medidas de la camara.
        // si no hay una camara asignada pasar los valores de el room
        // if (this.camara) {
        //     this._GAME.clipContextGraphic(
        //         this.camara.size.x,
        //         this.camara.size.y
        //     );
        // } else {
        //     this._GAME.clipContextGraphic(this.w, this.h);
        // }

        this._GAME.clipContextGraphic(this.w, this.h);

        // mover context
        ctx.translate(this.positionContextRoom.x, this.positionContextRoom.y);



        // renderizar objetos
        this._INSTANCES.forEach((instance) => {
            this.renderObejct(instance, ctx);
        });
        this.draw(ctx);

        this._GAME.resetContextGraphic();

        // renderizar los objetos que pertenecen a la interfaz grafica
        this._INSTANCESUI.forEach((instanceUI) => {
            instanceUI.main(ctx);
        });
    };
}
