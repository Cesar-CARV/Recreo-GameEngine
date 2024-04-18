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
import Vector2 from "./GameEngine/Vector2.js";

// -------------------- GAME SETTINGS --------------------- //
const $game = document.querySelector("#game");
const $gameInput = $game.querySelector("#game__input");
const $gameCanvas = document.querySelector("#game__display");
const GAME = new Game($game, $gameCanvas, $gameInput, 700, 500, 64);

// -------------------- INSTANCES --------------------- //
const playerSprite = new Sprite(GAME, 0, 0, 48, 62, "./../spriteTest.png");
const playerAnimator = new SpriteAnimator(GAME, [
    new KeyFrame(0, 0, 16, 16, 50, 50),
    new KeyFrame(16, 0, 16, 16, 50, 50),
    new KeyFrame(32, 0, 16, 16, 50, 50),
    new KeyFrame(0, 16, 16, 16, 50, 50),
    new KeyFrame(16, 16, 16, 16, 50, 50),
], 1000 / 12);

playerAnimator.addChild(playerSprite, "playerSprite");

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
    if (Input.GetKeyDown("t")) player.changePosition(0, 0);
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

    if (Input.GetKeyDown("k")) {
        console.log("kill");
        playerContainer._GAME.currentRoom.removeInstance(false, "playerContainer");
    }
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

room1.addInstance(playerContainer, false, "playerContainer");
room1.addInstance(stopButton, true, "stopButton");
room1.addInstance(pauseButton, true, "pauseButton");

GAME.addRoom(room1);
GAME.changeRoom("Room1_test", false);
GAME.startGame();


console.log(room1);
console.log(player._CHILDREN);
