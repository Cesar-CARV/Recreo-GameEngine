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
      "../Sprites/Coin.png"
    );
    // animations
    this.animations = {
      idle: [
        new KeyFrame(0, 0, 32, 32, 32, 32),
        new KeyFrame(32, 0, 32, 32, 32, 32),
        new KeyFrame(64, 0, 32, 32, 32, 32),
        new KeyFrame(96, 0, 32, 32, 32, 32),
        new KeyFrame(128, 0, 32, 32, 32, 32),
        new KeyFrame(160, 0, 32, 32, 32, 32),
      ],
    };
    this.sprite.setAnimation(this.animations.idle, .1);

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
      this._GAME.playSound("./../Sounds/SFX_Jump_40.wav", .2);
      this.kamikaze(() => console.log("+1"));
    }
  };
}
