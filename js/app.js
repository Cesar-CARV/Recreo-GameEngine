import Game from './engine/game.js';

// ----------------------- IMPORTS ------------------------
import Obj from "./engine/object.js";
import UIButton from "./engine/UI.button.js";
import UIInput from "./engine/UI.input.js";
import UILabel from './engine/UI.label.js';
import Room from './engine/room.js';
import Bird from "./bird.js";
import Wall from "./wall.js";


// -------------------- GAME SETTINGS ---------------------
const $game = document.querySelector('#game');
const $gameInput = $game.querySelector('#game__input');
const $gameDisplay = document.querySelector('#game__display');
const GAME = new Game($gameDisplay, $gameInput, 700, 500, 64);

// ---------------------- INSTANCES -----------------------
// obj
let obj = new Obj(GAME, 0, GAME.display.h - 60, GAME.display.w, 60);
// bird
let bird = new Bird(GAME, GAME.display.w / 2 - 15, GAME.display.h / 2 - 15, 30, 30);
// wall
let wall = new Wall(GAME, GAME.display.w, 300, 50, 100, 4, false);


// stopButon
let stopButton = new UIButton(GAME, 5, 5, 0, 0, "STOP");
stopButton.isPauseable = false;
stopButton.onMouseDown = (e) => {GAME.endGame();}

// resetButton
let resetGame = new UIButton(GAME, 0, 220, 140, 40, "Reset Game");
resetGame.isPauseable = false;
resetGame.visible = false;
resetGame.onMouseDown = (e) => {
    bird.x = GAME.display.w / 2 - 15;
    bird.y = GAME.display.h / 2 - 15;
    bird.moveL = false;
    bird.moveR = false;
    bird.speedV = 0;
    wall.x = GAME.display.w;
    wall.y = 300;
    GAME.pauseGame = false;
    GAME.hoverUI = false;
    resetGame.mouseOn = false;
    resetGame.hover = false;
    resetGame.leave = false;
    resetGame.visible = false;
}
resetGame.onMouseUp = (e) => $gameInput.focus();

// UI2
let ui2Button = new UIButton(GAME, 100, 80, 0, 0, "Hola mundo", 20, "#eee5", "#262626");

// inputText
let input = new UIInput(GAME, 100, 30, 0, 0, "")

// ------------------------- ROOM -------------------------
let room1 = new Room(GAME, GAME.display.w, GAME.display.h);
room1.addInstance(bird);
room1.addInstance(obj);
room1.addInstance(wall);
room1.addInstance(stopButton, true);
room1.addInstance(resetGame, true);

let room2 = new Room(GAME, GAME.display.w, GAME.display.h);
room2.addInstance(new Bird(GAME, GAME.display.w / 2 - 15, GAME.display.h / 2 - 15, 30, 30));
room2.addInstance(obj);
room2.addInstance(stopButton, true);
room2.addInstance(ui2Button, true);
room2.addInstance(input, true);
room2.addInstance(new UILabel(GAME, 100, 120, 0, 0, "SCORE:", 20), true);

GAME.addRoom("room1", room1);
GAME.addRoom("testRoom", room2);
GAME.changeRoom("room1");

GAME.startGame();

console.log(GAME);