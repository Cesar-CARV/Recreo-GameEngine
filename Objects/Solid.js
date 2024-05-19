import Object from "../GameEngine/Object.js";
import BoxCollider from "../GameEngine/BoxCollider.js";

export default class Solid extends Object {
  constructor(GAME, x, y, w, h) {
    super(GAME, x, y, w, h);
    this.collider = new BoxCollider(GAME, 0, 0, w, h, 0, [], false);
    this.addChild(this.collider, "collider");
  }
}
