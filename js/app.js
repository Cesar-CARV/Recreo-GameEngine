import Game from './engine/game.js';

// ----------------------- IMPORTS ------------------------
import Obj from "./engine/object.js";
import UIButton from "./engine/UI.button.js";
import UIInput from "./engine/UI.input.js";
import UILabel from './engine/UI.label.js';
import Room from './engine/room.js';
import Bird from "./bird.js";
import Wall from "./wall.js";
import TileMap from './engine/tileMap.js';
import Background from './engine/background.js'


// -------------------- GAME SETTINGS ---------------------
const $game = document.querySelector('#game');
const $gameInput = $game.querySelector('#game__input');
const $gameDisplay = document.querySelector('#game__display');
const GAME = new Game($gameDisplay, $gameInput, 700, 500, 64);

// ---------------------- INSTANCES -----------------------
// obj
let obj = new Obj(GAME, 0, GAME.display.h - 60, GAME.display.w, 60);
obj.draw = () => {} 
// bird
let bird = new Bird(GAME, GAME.display.w / 2 - 15, GAME.display.h / 2 - 15, 30, 30);
// wall
let wall = new Wall(GAME, GAME.display.w, 300, 50, 100, 4, false);

// bird Room2
let bird2 =new Bird(GAME, GAME.display.w / 2 - 15, GAME.display.h / 2 - 15, 25, 25)

// stopButon
let stopButton = new UIButton(GAME, 5, 5, 0, 0, "STOP", 20, "#eee", "#f63", "#000", "#fff");
stopButton.isPauseable = false;
stopButton.onMouseDown = (e) => {GAME.endGame();}

// resetButton
let resetGame = new UIButton(GAME, 0, 220, 140, 40, "Reset Game ⏱️");
resetGame.isPauseable = false;
resetGame.visible = false;
resetGame.onMouseDown = (e) => {
    bird.restartValues();
    wall.x = GAME.display.w;
    wall.y = 300;
    GAME.pauseGame = false;
    GAME.hoverUI = false;
    resetGame.mouseOn = false;
    resetGame.hover = false;
    resetGame.leave = false;
    resetGame.visible = false;
    room1.camara.x = 0;
    room1.camara.y = 0;
}
resetGame.onMouseUp = (e) => $gameInput.focus();

// UI2
let ui2Button = new UIButton(GAME, 100, 80, 0, 0, "Hola mundo", 20);

// inputText
let input = new UIInput(GAME, 100, 30, 0, 0, "")

// TileMap1
let tileMap = new TileMap(GAME, "./../tileMapTest.png", 32, 32);
for (let i = 0; i < GAME.display.w / 32; i ++){
    tileMap.addTile(32 * i, GAME.display.h - 60, 0, 0, 16, 16);
    tileMap.addTile(32 * i, GAME.display.h - 28, 16, 0, 16, 16);
}
// ------------------------- ROOM -------------------------
let room1 = new Room(GAME, GAME.display.w * 2, GAME.display.h + 60);
room1.addInstance(bird);
room1.addInstance(obj);
room1.addInstance(wall);
room1.addInstance(stopButton, true);
room1.addInstance(resetGame, true);
room1.addInstance(new UIButton(GAME, 100, 80, 0, 0, "Cambiar room a 'testRoom'", 20), true);
room1.addBackground(new Background(GAME, 0, 0, room1.w, room1.h, undefined, "#016ac1"));
room1.addBackground(new Background(GAME, 100, 50, 70, 30, undefined, "#fff5"));
room1.tileMapLayer1 = tileMap;
room1.camara.setTarget(bird);

let room2 = new Room(GAME, GAME.display.w * 2, GAME.display.h + 60);
room2.addInstance(bird2);
room2.addInstance(new Obj(GAME, 0, GAME.display.h - 60, GAME.display.w, 60));
room2.addInstance(new Obj(GAME, GAME.display.w + 30, GAME.display.h - 90, 30, 30));
//room2.addInstance(new Obj(GAME, GAME.display.w, GAME.display.h - 30, 30, 30));
room2.addInstance(new Obj(GAME, GAME.display.w, GAME.display.h - 120, 30, 30));
room2.addInstance(stopButton, true);
room2.addInstance(ui2Button, true);
room2.addInstance(input, true);
room2.addInstance(new UILabel(GAME, 100, 120, 0, 0, "SCORE:", 20), true);
room2.camara.setTarget(bird2);
//room2.camara.mode = room2.camara.CAMMODES.Limits;

GAME.addRoom("room1", room1);
GAME.addRoom("testRoom", room2);
GAME.changeRoom("room1");

GAME.startGame();

console.log(GAME);