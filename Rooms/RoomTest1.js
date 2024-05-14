import Room from "./../GameEngine/Room.js";

import BoxCollider from "../GameEngine/BoxCollider.js";
import Object from "../GameEngine/Object.js";
import UI from "../GameEngine/UI.js";
import UIButton from "../GameEngine/UI.Button.js";
import UILabel from "../GameEngine/UI.Label.js";
import Background from "../GameEngine/Background.js";
import Tilemap from "../GameEngine/Tilemap.js";
import Player from "../Objects/Player.js";

export default class RoomTest1 extends Room {
  constructor(GAME) {
    super(GAME, GAME.w * 2, GAME.h * 2);

    const player = new Player(
      this._GAME,
      this._GAME.w / 2 - 25,
      this._GAME.h / 2 - 25
    );

    const node1 = new Object(this._GAME, 10, 0, 10, 10);
    const node2 = new Object(this._GAME, 30, 0, 10, 10);
    const node3 = new Object(this._GAME, 50, 0, 10, 10);
    const node2_2 = new Object(this._GAME, 0, 20, 60, 10);
    const node2_2Collider = new BoxCollider(
      this._GAME,
      0,
      0,
      60,
      10,
      0,
      [],
      true
    );
    node2_2.addChild(node2_2Collider, "node2_2Collider");

    node1.draw = (ctx) => {
      ctx.fillStyle = "#363636";
      ctx.fillRect(
        node1.position.x,
        node1.position.y,
        node1.size.x,
        node1.size.y
      );
    };
    node2.draw = (ctx) => {
      ctx.fillStyle = "#363636";
      ctx.fillRect(
        node2.position.x,
        node2.position.y,
        node2.size.x,
        node2.size.y
      );
    };
    node3.draw = (ctx) => {
      ctx.fillStyle = "#363636";
      ctx.fillRect(
        node3.position.x,
        node3.position.y,
        node3.size.x,
        node3.size.y
      );
    };
    node2_2.draw = (ctx) => {
      ctx.fillStyle = "#561";
      ctx.fillRect(
        node2_2.position.x,
        node2_2.position.y,
        node2_2.size.x,
        node2_2.size.y
      );
    };

    node2.addChild(node2_2, "subNodo2");

    // -------------------------------------------------------------
    // Floor
    const floorCollider = new BoxCollider(
      this._GAME,
      0,
      0,
      this._GAME.w * 2,
      50,
      0,
      [],
      true
    );
    const floor = new Object(
      this._GAME,
      0,
      this._GAME.h - 75,
      this._GAME.w,
      50
    );
    floor.addChild(floorCollider, "floorCollider");

    // -------------------------------------------------------------
    // Wall
    const wallCollider = new BoxCollider(
      this._GAME,
      0,
      0,
      32,
      100,
      0,
      [],
      true
    );
    const wall = new Object(this._GAME, 150, this._GAME.h - 175, 32, 100);
    wall.addChild(wallCollider, "wallCollider");

    // -------------------------------------------------------------
    // Wall2
    const wall2Collider = new BoxCollider(
      this._GAME,
      0,
      0,
      30,
      100,
      0,
      [],
      true
    );
    const wall2 = new Object(this._GAME, 240, this._GAME.h - 175, 30, 100);
    wall2.addChild(wall2Collider, "wall2Collider");

    // -------------------------------------------------------------
    // UI
    const stopButton = new UIButton(this._GAME, 10, 10, 120, 40, "STOP GAME");
    stopButton.align = "center";
    stopButton.backgroundColorHover = "#f35";
    stopButton.backgroundColorPressed = "#CC063B";
    stopButton.colorPressed = "#EB7393";
    stopButton.onClick = () => {
      this._GAME.stopGame();
    };

    const pauseButton = new UIButton(this._GAME, 140, 10, 80, 40, "PAUSE");
    pauseButton.align = "center";
    pauseButton.onClick = () => {
      this._GAME.gamePaused ? this._GAME.playGame() : this._GAME.pauseGame();
      pauseButton.text = this._GAME.gamePaused ? "PLAY" : "PAUSE";
    };

    const UIContainer = new UI(
      this._GAME,
      10,
      this._GAME.h - 80,
      this._GAME.w - 20,
      60
    );
    UIContainer.draw = (ctx) => {
      ctx.fillStyle = "#0003";
      ctx.fillRect(
        UIContainer.position.x,
        UIContainer.position.y,
        UIContainer.size.x,
        UIContainer.size.y
      );
    };

    UIContainer.addChild(stopButton, "stopButton");
    UIContainer.addChild(pauseButton, "pauseButton");

    // -------------------------------------------------------------
    // TileMap1
    let tileMap = new Tilemap(
      this._GAME,
      "./../Tilemaps/tileMapTest.png",
      32,
      32
    );
    for (let i = 0; i < this._GAME.w / 32; i++) {
      tileMap.addTile(32 * i, this._GAME.h - 60, 0, 0, 16, 16);
      tileMap.addTile(32 * i, this._GAME.h - 28, 16, 0, 16, 16);
    }

    // -------------------------------------------------------------
    // Titulo
    const title = new UILabel(
      this._GAME,
      40,
      20,
      this._GAME.w - 80,
      60,
      "ROOM TEST"
    );
    title.backgroundColor = "#f355";
    title.color = "#fff";
    title.align = "center";
    title.steps = () => {
      const pylr = this._GAME.currentRoom.findByName("player", false);
      if (!pylr) return;
      title.text = "ROOM TEST " + Math.floor(pylr.velocity.y);
    };

    // -------------------------------------------------------------
    // background 1
    const room1Background = new Background(
      this._GAME,
      -this._GAME.w / 2,
      -this._GAME.h / 2,
      this._GAME.w * 2,
      this._GAME.h * 2,
      "./../Backgrounds/Fondo_01.png"
    );
    room1Background.static = true;
    // -------------------------------------------------------------
    // background 2
    const room1Background2 = new Background(
      this._GAME,
      0,
      0,
      100,
      100,
      "./../Backgrounds/Fondo_01.png"
    );

    const room1Background3 = new Background(
      this._GAME,
      this._GAME.w * 2 - 100,
      0,
      100,
      100,
      "./../Tilemaps/tileMapTest.png"
    );

    this.tileMapLayer1 = tileMap;

    this.addBackground(room1Background);
    this.addBackground(room1Background2);
    this.addBackground(room1Background3);
    this.addInstance(player, false, "player");
    this.addInstance(node1, false, "node1");
    this.addInstance(node2, false, "node2");
    this.addInstance(node3, false, "node3");
    this.addInstance(floor, false, "floor");
    this.addInstance(wall, false, "wall");
    this.addInstance(wall2, false, "wall2");
    this.addInstance(title, true, "title");
    this.addInstance(UIContainer, true, "UIContainer");
  }
}
