import Object from "./../GameEngine/Object.js";
import Sprite from "./../GameEngine/Sprite.js";
import { SpriteAnimator, KeyFrame } from "./../GameEngine/Animator.js";
import Camara from "./../GameEngine/Camara.js";
import Input from "./../GameEngine/Input.js";
import BoxCollider from "../GameEngine/BoxCollider.js";
import Time from "../GameEngine/Time.js";
import Vector2 from "../GameEngine/Vector2.js";

export default class Player extends Object {
  constructor(GAME, x, y) {
    super(GAME, x, y, 50, 50);
    // propiedades
    this.velocity = new Vector2(0, 0);
    this.gravity = 5;
    this.jump = -100;

    // animations
    this.animations = {
      idle: [
        new KeyFrame(0, 0, 16, 16, 50, 50),
        new KeyFrame(16, 0, 16, 16, 50, 50),
        new KeyFrame(32, 0, 16, 16, 50, 50),
      ],
      run: [
        new KeyFrame(0, 32, 16, 16, 50, 50),
        new KeyFrame(16, 32, 16, 16, 50, 50),
        new KeyFrame(32, 32, 16, 16, 50, 50),
        new KeyFrame(48, 32, 16, 16, 50, 50),
      ],
    };
    // sprite
    this.sprite = new Sprite(this._GAME, 0, 0, 48, 62, "./../Sprites/elf.png");
    // animator
    this.animator = new SpriteAnimator(
      this._GAME,
      this.animations.idle,
      1000 / 6
    );
    this.animator.addChild(this.sprite, "playerSprite");
    // camara
    this.camara = new Camara(this._GAME, 0, 0, this._GAME.w, this._GAME.h);
    this.camara.setScale(0.01, 0.01);
    // collider
    this.collider = new BoxCollider(this._GAME, 0, 0, 50, 50, 0, [], true);
    // add children
    this.addChild(this.collider, "playerCollider");
    this.addChild(this.animator, "animator");
    this.addChild(this.camara, "camara");

    this.animator.play();
  }

  steps = () => {
    if (this.camara.scaleX < 1 && this.camara.scaleY < 1)
      this.camara.setScale(
        this.camara.scaleX + 0.01,
        this.camara.scaleY + 0.01
      );

    // velocidad horizontal
    this.velocity.x =
      (Input.GetKeyPress("d") - Input.GetKeyPress("a")) *
      40 *
      Time.deltaTime *
      10;

    const onFloor = this.collider.onPlaceMeetingBox(
      new Vector2(this.position.x, this.position.y + 1 + this.velocity.y)
    );

    const onWall = this.collider.onPlaceMeetingBox(
      new Vector2(
        this.position.x + this.velocity.x + Math.sign(this.velocity.x),
        this.position.y
      )
    );

    // gravedad
    if (!onFloor.res && this.velocity.y < 40) {
      this.velocity.y += this.gravity * Time.deltaTime * 10;
    }

    // salto
    if (onFloor.res && Input.GetKeyPress("w")) {
      this.velocity.y = this.jump * Time.deltaTime * 10;
    } else if (onFloor.res) {
      this.velocity.y = 0;
      this.position.y +=
        onFloor.target.absolutePosition.y - this.position.y - this.size.y - 1;
    }

    // colision con la pared
    if (onWall.res) {
      if (
        onWall.target.absolutePosition.x < this.position.x &&
        this.velocity.x < 0
      ) {
        this.velocity.x = 0;
        this.position.x -=
          this.position.x -
          onWall.target.absolutePosition.x -
          onWall.target.size.x -
          1;
      } else if (
        onWall.target.absolutePosition.x > this.position.x &&
        this.velocity.x > 0
      ) {
        this.velocity.x = 0;
        this.position.x +=
          onWall.target.absolutePosition.x - this.position.x - this.size.x - 1;
      }
    }

    // teletransportar
    if (Input.GetKeyDown("t")) {
      this.changePosition(0, 0);
    }
    // cambiar de nivel
    if (Input.GetKeyDown("c")) {
      this._GAME.changeRoom("RoomTest2");
    }

    if (
      this.animator.keyFrames === this.animations.idle &&
      this.velocity.x !== 0
    ) {
      this.animator.changeAnimation(this.animations.run, 1000 / 6);
    } else if (
      this.animator.keyFrames === this.animations.run &&
      this.velocity.x === 0
    ) {
      this.animator.changeAnimation(this.animations.idle, 1000 / 6);
    }

    if (this.velocity.x < 0) {
      this.sprite.flipX = true;
    } else if (this.velocity.x > 0) {
      this.sprite.flipX = false;
    }

    // mover
    this.position = this.position.Sum(this.velocity);

    // destruir objeto con el metodo kamikaze
    if (Input.GetKeyDown("k")) {
      const obj = this._GAME.currentRoom.findByName("subNodo2", false);
      console.log(obj);
      if (obj) obj.kamikaze(() => console.log("HOLA"));
    }
  };
}
