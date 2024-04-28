import Object from "./Object.js";
import Vector2 from "./Vector2.js";

export default class BoxCollider extends Object {
    constructor(GAME, x, y, w, h, layer, exceptions = [], show = false) {
        super(GAME, x, y, w, h);
        this.layer = layer;
        this.exceptions = exceptions;
        this.show = show;
        this.absolutePosition = new Vector2(-9999999, -9999999);

        this.collides = new Set();
    }

    // actualiza la posicion de el objeto segun la posicion del padre
    updatePosition = () => {
        this.position = this._PARENT
            ? new Vector2(
                  this._PARENT.position.x + this.position.x,
                  this._PARENT.position.y + this.position.y
              )
            : this.position;

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
     * @param {Object} node 
     * @param {Set} nodesVisited 
     * @returns
     */
    iterateTree = (condition, node = undefined, nodesVisited = new Set()) => {
        if (node) {
            // comprueba las condiciones de la funcion condition para detectar uan colision
            if (condition(node)) {
                // return true;
                return {res: true, target: node};
            }

            // si el nodo no es el que se busca se agrega al set
            nodesVisited.add(node);

            // comprueba si no tiene hijos, si no tiene se retorna a el padre
            if (node._CHILDREN.length === 0) {
                return this.iterateTree(condition, node._PARENT, nodesVisited);
            }

            // comprueba si tiene hijos, si es asi valida que los hijos no se encuentren el el set
            // y de ser asi retornara la funcion con el parametro de nodo como el primer hijo
            if (node._CHILDREN.length !== 0) {
                const children = window.Object.values(node._CHILDREN).filter(
                    (nd) => !nodesVisited.has(nd)
                );

                if (children.length === 0) {
                    return this.iterateTree(
                        condition,
                        node._PARENT,
                        nodesVisited
                    );
                }

                return this.iterateTree(condition, children[0], nodesVisited);
            }
        }

        // si no el nodo no existe se filtran los nodos hijos de el room
        // y se busca en el primer indice
        const instances = window.Object.values(
            this._GAME.currentRoom._INSTANCES
        ).filter((nd) => !nodesVisited.has(nd));

        // if (instances.length === 0) return false;
        if (instances.length === 0) return {res: false, target: undefined};
        return this.iterateTree(condition, instances[0], nodesVisited);
    };

    collideRules = (node) => {
        // detecta si el nodo es del tipo BoxCollider y no es el mismo que el que llama el metodo
        if (node === this || !(node instanceof BoxCollider)) return false;

        // detecta si el objeto con el que coliciona esta en la misma layer o no es una excepcion
        if (node.layer !== this.layer && node.exceptions.includes(node))
            return false;

        return true;
    };

    // detecta si un objeto del tipo BoxCollider entra en el Area
    onArea = () => {
        return this.iterateTree((node) => {
            if (!this.collideRules(node)) return false

            return (
                this.absolutePosition.x + this.size.x >= node.absolutePosition.x &&
                this.absolutePosition.x <= node.absolutePosition.x + node.size.x &&
                this.absolutePosition.y + this.size.y >= node.absolutePosition.y &&
                this.absolutePosition.y <= node.absolutePosition.y + node.size.y
            );
        });
    };

    // detecta si un objeto del tipo BoxCollider entra en las coordenadas que recibe como parametro
    /**
     * 
     * @param {Vector2} position 
     */
    onPlaceMeeting = (position) => {
        return this.iterateTree((node) => {
            if (!this.collideRules(node)) return false;

            return (
                position.x >= node.absolutePosition.x &&
                position.x <= node.absolutePosition.x + node.size.x &&
                position.y >= node.absolutePosition.y &&
                position.y <= node.absolutePosition.y + node.size.y
            );
        });
    };

    // detecta si un objeto del tipo BoxCollider entra en las coordenadas mas el size 
    // de el bojeto que ejecuta la funcion que recibe como parametro
    /**
     * 
     * @param {Vector2} position 
     * @return {object}
     */
    onPlaceMeetingBox = (position) => {
        return this.iterateTree((node) => {
            if (!this.collideRules(node)) return false

            return (
                position.x + this.size.x >= node.absolutePosition.x &&
                position.x <= node.absolutePosition.x + node.size.x &&
                position.y + this.size.y >= node.absolutePosition.y &&
                position.y <= node.absolutePosition.y + node.size.y
            );
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
     * @return {object}
     */
    onRectangleCollision = (x, y, x2, y2) => {
        return this.iterateTree((node) => {
            if (!this.collideRules(node)) return false

            return (
                x + x2 >= node.absolutePosition.x &&
                x <= node.absolutePosition.x + node.size.x &&
                y + y2 >= node.absolutePosition.y &&
                y <= node.absolutePosition.y + node.size.y
            );
        });
    }

}
