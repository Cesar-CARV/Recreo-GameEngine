import Object from "./../GameEngine/Object.js";
import Sprite from "./../GameEngine/Sprite.js";
import KeyFrame from "../GameEngine/KeyFrame.js";
import Camara from "./../GameEngine/Camara.js";
import Input from "./../GameEngine/Input.js";
import BoxCollider from "../GameEngine/BoxCollider.js";
import Time from "../GameEngine/Time.js";
import Vector2 from "../GameEngine/Vector2.js";
import Clock from "../GameEngine/Clock.js";

export default class Player extends Object {
  constructor(GAME, x, y) {
    super(GAME, x, y, 50, 50);
    // propiedades
    this.velocity = new Vector2(0, 0);
    this.gravity = 98;
    this.jump = -1200;

    this.constructorProps = {x: "number", y: "number"};
    this.editorPropertys = {gravity: "number", jump: "number"};
    
    // clock
    this.clock = new Clock(GAME, 5, false);

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
    this.sprite = new Sprite(GAME, 0, 0, 48, 62, "./../Sprites/elf.png");
    this.sprite.setAnimation(this.animations.idle);
    // camara
    this.camara = new Camara(GAME, 0, 0, GAME.w, GAME.h);
    this.camara.setScale(0.01, 0.01);
    // collider
    this.collider = new BoxCollider(GAME, 0, 0, 50, 50, 0, [], true);
    // add children
    this.addChild(this.collider, "playerCollider");
    this.addChild(this.sprite, "sprite");
    this.addChild(this.camara, "camara");
  }

  onCreate = () => {
    console.log("Hola desde player");

    this.sprite.play();

    this.camara.setCamaraLimits(
      0,
      0,
      this._GAME.currentRoom.w,
      this._GAME.currentRoom.h
    );

    if (!this.clock.runing) this.clock.start();
  };

  steps = () => {
    this.clock.tick(() => console.log("Fin de el timer 5 sec despues de ser creado"));

    if (this.camara.scaleX < 1 && this.camara.scaleY < 1)
      this.camara.setScale(
        this.camara.scaleX + 0.01,
        this.camara.scaleY + 0.01
      );

    // velocidad horizontal
    this.velocity.x =
      (Input.GetKeyPress("d") - Input.GetKeyPress("a")) * 400 * Time.deltaTime;

    // detectar colisiones
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
    if (!onFloor.res && this.velocity.y < 100) {
      this.velocity.y += this.gravity * Time.deltaTime;
      if (this.velocity.y > 100) {
        this.velocity.y = 100;
      }
    }

    // salto
    if (onFloor.res && Input.GetKeyPress("w")) {
      this.velocity.y = this.jump * Time.deltaTime;
    } else if (onFloor.res) {
      this.velocity.y = 0;
      this.position.y +=
        onFloor.target.absolutePosition.y - this.position.y - this.size.y - 1;
    }

    // animaciones
    if (
      this.sprite.animation === this.animations.idle &&
      this.velocity.x !== 0
    ) {
      this.sprite.changeAnimation(this.animations.run, 1000 / 6);
    } else if (
      this.sprite.animation === this.animations.run &&
      this.velocity.x === 0
    ) {
      this.sprite.changeAnimation(this.animations.idle, 1000 / 6);
    }

    if (this.velocity.x < 0) {
      this.sprite.flipX = true;
    } else if (this.velocity.x > 0) {
      this.sprite.flipX = false;
    }

    // colision con la pared
    if (onWall.res) {
      if (
        onWall.target.absolutePosition.x < this.position.x &&
        this.velocity.x < 0
      ) {
        this.velocity.x = 0;
        let dis =
          this.position.x -
          onWall.target.absolutePosition.x -
          onWall.target.size.x -
          1;

        for (let i = 0; i < dis; i++) {
          this.position.x--;
        }
      } else if (
        onWall.target.absolutePosition.x > this.position.x &&
        this.velocity.x > 0
      ) {
        this.velocity.x = 0;
        let dis =
          onWall.target.absolutePosition.x - this.position.x - this.size.x - 1;
        for (let i = 0; i < dis - 1; i++) {
          this.position.x++;
        }
      }
    }

    // teletransportar
    if (Input.GetKeyDown("t")) {
      this.changePosition(this.position.x, 0);
    }
    // cambiar de nivel
    if (Input.GetKeyDown("c")) {
      this._GAME.changeRoom("RoomTest2", true);
    }

    // mover
    this.position = this.position.Sum(this.velocity);

    // destruir objeto con el metodo kamikaze
    if (Input.GetKeyDown("k")) {
      const obj = GAME.currentRoom.findByName("subNodo2", false);
      console.log(obj);
      if (obj) obj.kamikaze(() => console.log("HOLA"));
    }
  };
}
