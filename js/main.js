import Game from "./GameEngine/Game.js";
import Input from "./GameEngine/Input.js";
import Room from "./GameEngine/Room.js";
import Object from "./GameEngine/Object.js";
import Camara from "./GameEngine/Camara.js";
import UIButton from "./GameEngine/UI.Button.js";
import UIInput from "./GameEngine/UI.Input.js";
import UILabel from "./GameEngine/UI.Label.js";
import Sprite from "./GameEngine/Sprite.js";
import {SpriteAnimator, KeyFrame} from "./GameEngine/Animator.js";
import Background from "./GameEngine/Background.js";
import Time from "./GameEngine/Time.js";
import Tilemap from "./GameEngine/Tilemap.js";
import BoxCollider from "./GameEngine/BoxCollider.js";

// -------------------- GAME SETTINGS ---------------------
const $game = document.querySelector('#game');
const $gameInput = $game.querySelector('#game__input');
const $gameCanvas = document.querySelector('#game__display');
const GAME = new Game($game, $gameCanvas, $gameInput, 700, 500, 64);

// ---------- PLAYER ----------
let player = new Object(GAME, 0, 10, 32, 32);
player._BOXCOLLIDER = new BoxCollider(GAME, player, 0, 0, 32, 32, 0, [], true);
player._ANIMATOR = new SpriteAnimator(player, new Sprite(0, 0, 100, 130, "./../spriteTest2.png",false), [new KeyFrame(0,0,16,16,32,32), new KeyFrame(16,0,16,16,32,32)], true, 1000 / 6);
player._ANIMATOR.playAnimation();

player.draw = (ctx) => {
    ctx.fillStyle = "#a504";
    ctx.fillRect(player.x, player.y, player.w, player.h);
}

player.steps = () => {
    if (Input.GetKeyPress("a")) player.x -= 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("d")) player.x += 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("w")) player.y -= 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("s")) player.y += 40 * Time.deltaTime * 10;

    console.log(player._BOXCOLLIDER.onArea());
}
// ---------- END PLAYER ----------

// ---------- AREA ----------
let area = new Object(GAME, 90, 200, 50, 50);
area._BOXCOLLIDER = new BoxCollider(GAME, area, 0, 0, 50, 50, 0, [], true);
// ---------- END AREA ----------


let stopButton = new UIButton(GAME, 100, 10, 0,0, "STOP GAME", 16, "#eee", "#f63", "#000", "#fff", 10, true);
stopButton.onMouseDown = () => {GAME.stopGame();}

// TileMap1
let tileMap = new Tilemap(GAME, "./../tileMapTest.png", 32, 32);
for (let i = 0; i < GAME.w / 32; i ++){
    tileMap.addTile(32 * i, GAME.h - 60, 0, 0, 16, 16);
    tileMap.addTile(32 * i, GAME.h - 28, 16, 0, 16, 16);
}

const testRoom = new Room(GAME, GAME.w * 2, GAME.h, "testRoom");
testRoom.addInstance(player);
testRoom.addInstance(area);
testRoom.addInstance(new Object(GAME, 90, 90, 10, 10));
testRoom.addInstance(new Object(GAME, testRoom.w - 10, 0, 10, testRoom.h));
testRoom.addInstance(new Object(GAME, 0, testRoom.h - 10, testRoom.w, 10));
testRoom.addInstance(new Object(GAME, GAME.w - 50, 50, 50, 50));
testRoom.addInstance(new Object(GAME, GAME.w, 100, 50, 50));
//testRoom.addInstance(new UIButton(GAME, 10, 200, 0,0, "HOLA MUNDO DESDE UN BOTON", 30), true);
//testRoom.addInstance(new UIInput(GAME, 100, 400, 0,0, "", "PLACEHOLDER", 30), true);
//testRoom.addInstance(new UILabel(GAME, 200, 100, 0,0, "Hola Mundo Desde Una Label", 10), true);
testRoom.addInstance(stopButton, true);
testRoom.setCamara(new Camara(GAME, testRoom, GAME.ctx, 0, 0, GAME.w, GAME.h, player));
testRoom.addBackground(new Background(GAME, 0, 0, GAME.w, GAME.h, undefined, "#29f"));
//testRoom.camara.mode = testRoom.camara.MODES.Borders;
testRoom.tileMapLayer1 = tileMap;


GAME.addRoom(testRoom);
GAME.changeRoom("testRoom");
GAME.startGame();