import Object from './../GameEngine/Object.js';
import Sprite from './../GameEngine/Sprite.js';

export default class Coin extends Object{
  constructor(GAME, x, y) {
    super(GAME, x, y, 10, 10);

    this.sprite = new Sprite(GAME, 0, 0, 10, 10, "./../Sprites/pickup_items_animated.png");
    this.addChild(this.sprite, "sprite");
    
  }
}