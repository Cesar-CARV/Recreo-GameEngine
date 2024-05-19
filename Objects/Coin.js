import Object from "../GameEngine/Object.js";
import Sprite from "../GameEngine/Sprite.js";
import BoxCollider from "../GameEngine/BoxCollider.js";
import KeyFrame from "../GameEngine/KeyFrame.js";
import Player from "../Objects/Player.js";

export default class Coin extends Object {
  constructor(GAME, x, y) {
    super(GAME, x, y, 30, 30);

    this.sprite = new Sprite(
      GAME,
      0,
      0,
      30,
      30,
      "../Sprites/pickup_items_animated.png"
    );
    // animations
    this.animations = {
      idle: [
        new KeyFrame(0, 0, 16, 16, 30, 30),
        new KeyFrame(16, 0, 16, 16, 30, 30),
        new KeyFrame(32, 0, 16, 16, 30, 30),
        new KeyFrame(48, 0, 16, 16, 30, 30),
      ],
    };
    this.sprite.setAnimation(this.animations.idle);

    this.collider = new BoxCollider(GAME, 0, 0, 30, 30, 0, [], true);

    this.addChild(this.collider, "collider");
    this.addChild(this.sprite, "sprite");
  }

  onCreate = () => {
    this.sprite.play();
  };

  steps = () => {
    const onArea = this.collider.onArea(Player);
    
    if (onArea.res) {
      this.kamikaze(() => console.log("+1"));
    }
  };
}
