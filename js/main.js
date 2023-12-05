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

// -------------------- GAME SETTINGS ---------------------
const $game = document.querySelector('#game');
const $gameInput = $game.querySelector('#game__input');
const $gameCanvas = document.querySelector('#game__display');
const GAME = new Game($game, $gameCanvas, $gameInput, 700, 500, 64);


let player = new Object(GAME, 10, 10, 50, 50);
//player._SPRITE = new Sprite(700, 300, 100, 130, "./../spriteTest.png", false);
//player._ANIMATOR = new SpriteAnimator(player, new Sprite(0, 0, 100, 130, "./../spriteTest.png",false), [new KeyFrame(0,0,16,16,50,50), new KeyFrame(0,16,16,16,50,50)], false);
player._ANIMATOR = new SpriteAnimator(player, new Sprite(0, 0, 100, 130, "./../spriteTest2.png",false), [new KeyFrame(0,0,16,16,50,50), new KeyFrame(16,0,16,16,50,50)], true, 1000 / 6);
player._ANIMATOR.playAnimation();
player.draw = (ctx) => {
    ctx.fillStyle = "#a504";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    //player._SPRITE.draw(ctx);
    //player._SPRITE.drawFollowTarget(ctx, player);
    //player._SPRITE.drawAtPoint(ctx, 300,300);
    //player._SPRITE.drawCut(ctx, 0, 0, 16, 16, 0, 0, 50, 50);
    //player._SPRITE.drawCutAndFollowTarget(ctx, player, 0, 0, 16, 16, 0, 0, 50, 50);
}

player.steps = () => {
    //if (Input.GetKeyDown("p")) player._SPRITE.autoDraw = !player._SPRITE.autoDraw;
    if (Input.GetKeyPress("a")) player.x -= 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("d")) player.x += 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("w")) player.y -= 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("s")) player.y += 40 * Time.deltaTime * 10;
}

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
testRoom.addInstance(new Object(GAME, 90, 90, 10, 10));
testRoom.addInstance(new Object(GAME, testRoom.w - 10, 0, 10, testRoom.h));
testRoom.addInstance(new Object(GAME, 0, testRoom.h - 10, testRoom.w, 10));
testRoom.addInstance(new Object(GAME, GAME.w - 50, 50, 50, 50));
testRoom.addInstance(new Object(GAME, GAME.w, 100, 50, 50));
testRoom.addInstance(new UIButton(GAME, 10, 200, 0,0, "HOLA MUNDO DESDE UN BOTON", 30), true);
testRoom.addInstance(new UIInput(GAME, 100, 400, 0,0, "", "PLACEHOLDER", 30), true);
testRoom.addInstance(new UILabel(GAME, 200, 100, 0,0, "Hola Mundo Desde Una Label", 10), true);
testRoom.addInstance(stopButton, true);
testRoom.setCamara(new Camara(GAME, testRoom, GAME.ctx, 0, 0, GAME.w, GAME.h, player));
//testRoom.addBackground(new Background(GAME, 0, 0, GAME.w, GAME.h, undefined, "#000"));
//testRoom.camara.mode = testRoom.camara.MODES.Borders;
testRoom.tileMapLayer1 = tileMap;


GAME.addRoom(testRoom);
GAME.changeRoom("testRoom");
GAME.startGame();
