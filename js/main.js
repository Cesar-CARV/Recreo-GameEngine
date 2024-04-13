import Game from "./GameEngine/Game.js";
import Input from "./GameEngine/Input.js";
import Room from "./GameEngine/Room.js";
import Object from "./GameEngine/Object.js";
import Camara from "./GameEngine/Camara.js";
import UIButton from "./GameEngine/UI.Button.js";
import UIInput from "./GameEngine/UI.Input.js";
import UILabel from "./GameEngine/UI.Label.js";
import Sprite from "./GameEngine/Sprite.js";
import { SpriteAnimator, KeyFrame } from "./GameEngine/Animator.js";
import Background from "./GameEngine/Background.js";
import Time from "./GameEngine/Time.js";
import Tilemap from "./GameEngine/Tilemap.js";
import BoxCollider from "./GameEngine/BoxCollider.js";

// -------------------- GAME SETTINGS ---------------------
const $game = document.querySelector("#game");
const $gameInput = $game.querySelector("#game__input");
const $gameCanvas = document.querySelector("#game__display");
const GAME = new Game($game, $gameCanvas, $gameInput, 700, 500, 64);

// // ---------- PLAYER ----------
// let player = new Object(GAME, 90, 10, 50, 50);
// player.sprites = [new Sprite(0, 0, 100, 130, "./../spriteTest.png",false), new Sprite(0, 0, 100, 130, "./../spriteTest2.png",false)];
// //player._BOXCOLLIDER = new BoxCollider(GAME, player, 0, 0, 50, 50, 0, [], true);
// player.addChild(new BoxCollider(GAME, player, 0, 0, 50, 50, 0, [], true) , "_BOXCOLLIDER");
// //player._ANIMATOR = new SpriteAnimator(player, player.sprites[0], [new KeyFrame(0,0,16,16,50,50), new KeyFrame(0,16,16,16,50,50)], true, 1000 / 6);
// //player._ANIMATOR.playAnimation();
// player.addChild(new SpriteAnimator(player, player.sprites[0], [new KeyFrame(0,0,16,16,50,50), new KeyFrame(0,16,16,16,50,50)], true, 1000 / 6), "_ANIMATOR");;
// player.getChild("_ANIMATOR").playAnimation();
// player.g = 10;
// player.vspeed = 0;

// player.draw = (ctx) => {
//     //ctx.fillStyle = "#f004";
//     //ctx.fillRect(player.x, player.y, player.w, player.h + (player.vspeed * 2 * Time.deltaTime * 10));
// }

// player.steps = () => {
//     if (Input.GetKeyPress("a")) player.x -= 40 * Time.deltaTime * 10;
//     if (Input.GetKeyPress("d")) player.x += 40 * Time.deltaTime * 10;
//     if (Input.GetKeyPress("s")) player.y += 40 * Time.deltaTime * 10;
//     if (Input.GetKeyDown("t")) player.y = 10;

//     let col = player.getChild("_BOXCOLLIDER").onArea().on;
//     if (col && player.getChild("_ANIMATOR").sprite === player.sprites[0]){
//         player.getChild("_ANIMATOR").sprite = player.sprites[1];
//     }
//     else if (!col && player.getChild("_ANIMATOR").sprite === player.sprites[1]) {
//         player.getChild("_ANIMATOR").sprite = player.sprites[0];
//     }

//     if (!player.getChild("_BOXCOLLIDER").isOnFloor(player.vspeed).on) {
//         player.vspeed = player.vspeed < 120 ? player.vspeed + player.g : 120;
//     }
//     else {
//         player.vspeed = player.vspeed > 0 ? 0 : player.vspeed;
//         if (Input.GetKeyPress("w")) player.vspeed = -70;
//     }

//     player.y += player.vspeed * Time.deltaTime * 10;
// }
// // ---------- END PLAYER ----------

// // ---------- AREA ----------
// let area = new Object(GAME, 90, 350, 400, 50);
// area._BOXCOLLIDER = new BoxCollider(GAME, area, 0, 0, 400, 50, 0, [], true);
// area.draw = (ctx) => {
//     ctx.fillStyle = "#00f8";
//     ctx.fillRect(area.x, area.y, area.w, area.h);
// }
// // ---------- END AREA ----------

// let stopButton = new UIButton(GAME, 100, 10, 0,0, "STOP GAME", 16, "#eee", "#f63", "#000", "#fff", 10, true);
// stopButton.onMouseDown = () => {GAME.stopGame();}

// let pauseButton = new UIButton(GAME, 10, 200, 0,0, "PAUSE", 30);
// pauseButton.onMouseDown = () => {GAME.pauseGame = !GAME.pauseGame; pauseButton.text = GAME.pauseGame ? "PLAY" : "PAUSE"}

// // TileMap1
// let tileMap = new Tilemap(GAME, "./../tileMapTest.png", 32, 32);
// for (let i = 0; i < GAME.w / 32; i ++){
//     tileMap.addTile(32 * i, GAME.h - 60, 0, 0, 16, 16);
//     tileMap.addTile(32 * i, GAME.h - 28, 16, 0, 16, 16);
// }

// const testRoom = new Room(GAME, GAME.w * 2, GAME.h, "testRoom");
// testRoom.addInstance(player);
// testRoom.addInstance(area);
// testRoom.addInstance(pauseButton, true);
// testRoom.addInstance(stopButton, true);
// testRoom.addInstance(new Object(GAME, 90, 200, 10, 10));
// testRoom.addInstance(new Object(GAME, testRoom.w - 10, 0, 10, testRoom.h));
// testRoom.addInstance(new Object(GAME, 0, testRoom.h - 10, testRoom.w, 10));
// testRoom.addInstance(new Object(GAME, GAME.w - 50, 50, 50, 50));
// testRoom.addInstance(new Object(GAME, GAME.w, 100, 50, 50));
// //testRoom.addInstance(new UIInput(GAME, 100, 400, 0,0, "", "PLACEHOLDER", 30), true);
// //testRoom.addInstance(new UILabel(GAME, 200, 100, 0,0, "Hola Mundo Desde Una Label", 10), true);
// testRoom.setCamara(new Camara(GAME, testRoom, GAME.ctx, 0, 0, GAME.w, GAME.h, player));
// testRoom.camara.mode = testRoom.camara.MODES.Center;
// testRoom.addBackground(new Background(GAME, 0, 0, GAME.w, GAME.h, undefined, "#29f"));
// testRoom.tileMapLayer1 = tileMap;

// GAME.addRoom(testRoom);
// GAME.changeRoom("testRoom");
// GAME.startGame();
const playerSprite = new Sprite(GAME, 0, 0, 48, 62, "./../spriteTest.png");
const playerAnimator = new SpriteAnimator(GAME, [
    new KeyFrame(0, 0, 16, 16, 50, 50),
    new KeyFrame(16, 0, 16, 16, 50, 50),
    new KeyFrame(32, 0, 16, 16, 50, 50),
    new KeyFrame(0, 16, 16, 16, 50, 50),
    new KeyFrame(16, 16, 16, 16, 50, 50),
], 1000 / 2);

playerAnimator.addChild(playerSprite, "player sprite");

const playerCamara = new Camara(GAME, 0, 0, GAME.w, GAME.h);

const player = new Object(GAME, 0, 0, 50, 50);
player.addChild(playerAnimator, "animator");
player.addChild(playerCamara, "camara");
player.draw = (ctx) => {
    ctx.fillStyle = "#363636";
    ctx.fillRect(
        player.position.x,
        player.position.y,
        player.size.x,
        player.size.y
    );
};

player.steps = () => {
    if (Input.GetKeyPress("a")) player.position.x -= 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("d")) player.position.x += 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("w")) player.position.y -= 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("s")) player.position.y += 40 * Time.deltaTime * 10;
};

playerAnimator.play();

const playerContainer = new Object(GAME, GAME.w / 2 - 25, GAME.h / 2 - 25, 200, 200);
playerContainer.addChild(player, "player");
playerContainer.draw = (ctx) => {
    ctx.fillStyle = "#222";
    ctx.fillRect(
        playerContainer.position.x,
        playerContainer.position.y,
        playerContainer.size.x,
        playerContainer.size.y
    );
};

playerContainer.steps = () => {
    if (Input.GetKeyPress("ArrowLeft"))
        playerContainer.position.x -= 40 * Time.deltaTime * 10;
    if (Input.GetKeyPress("ArrowRight"))
        playerContainer.position.x += 40 * Time.deltaTime * 10;
};

const stopButton = new UIButton(GAME, 10, GAME.h - 100, 0, 0, "STOP GAME", 16);
stopButton.onMouseDown = () => {
    GAME.stopGame();
};

let pauseButton = new UIButton(GAME, 130, GAME.h - 100, 0, 0, "PAUSE", 16);
pauseButton.onMouseDown = () => {
    GAME.pauseGame = !GAME.pauseGame;
    pauseButton.text = GAME.pauseGame ? "PLAY" : "PAUSE";
};



// TileMap1
let tileMap = new Tilemap(GAME, "./../tileMapTest.png", 32, 32);
for (let i = 0; i < GAME.w / 32; i ++){
    tileMap.addTile(32 * i, GAME.h - 60, 0, 0, 16, 16);
    tileMap.addTile(32 * i, GAME.h - 28, 16, 0, 16, 16);
}


const room1 = new Room(GAME, GAME.w * 2, GAME.h * 2, "Room1_test");
room1.tileMapLayer1 = tileMap;

// room1.setCamara(new Camara(GAME, 0, 0, GAME.w, GAME.h, player));
// room1.camara.mode = room1.camara.MODES.Center;

room1.addInstance(playerContainer, false);
room1.addInstance(stopButton, true);
room1.addInstance(pauseButton, true);

GAME.addRoom(room1);
GAME.changeRoom("Room1_test", false);
GAME.startGame();

