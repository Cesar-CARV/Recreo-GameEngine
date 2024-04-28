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
const playerAnimator = new SpriteAnimator(
    GAME,
    [
        new KeyFrame(0, 0, 16, 16, 50, 50),
        new KeyFrame(16, 0, 16, 16, 50, 50),
        new KeyFrame(32, 0, 16, 16, 50, 50),
        new KeyFrame(0, 16, 16, 16, 50, 50),
        new KeyFrame(16, 16, 16, 16, 50, 50),
    ],
    1000 / 12
);

playerAnimator.addChild(playerSprite, "playerSprite");

const playerCamara = new Camara(GAME, 0, 0, GAME.w, GAME.h);
playerCamara.setScale(0.01, 0.01);

const playerCollider = new BoxCollider(GAME, 0, 0, 50, 50, 0, [], true);

const player = new Object(GAME, 0, 0, 50, 50);
player.addChild(playerCollider, "playerCollider");
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
let playerVelocity = new Vector2(0, 0);
let playerGravity = 5;
let playerJump = -100;

player.steps = () => {
    const collider = player.getChild("playerCollider");

    if (playerCamara.scaleX < 1 && playerCamara.scaleY < 1)
        playerCamara.setScale(
            playerCamara.scaleX + 0.01,
            playerCamara.scaleY + 0.01
        );

    // velocidad horizontal
    playerVelocity.x =
        (Input.GetKeyPress("d") - Input.GetKeyPress("a")) *
        40 *
        Time.deltaTime *
        10;

    const onFloor = collider.onPlaceMeetingBox(
        new Vector2(player.position.x, player.position.y + 1 + playerVelocity.y)
    );

    const onWall = collider.onPlaceMeetingBox(
        new Vector2(
            player.position.x + playerVelocity.x + Math.sign(playerVelocity.x),
            player.position.y
        )
    );

    // gravedad
    if (!onFloor.res && playerVelocity.y < 40) {
        playerVelocity.y += playerGravity * Time.deltaTime * 10;
    }

    // salto
    if (onFloor.res && Input.GetKeyPress("w")) {
        playerVelocity.y = playerJump * Time.deltaTime * 10;
    } else if (onFloor.res) {
        playerVelocity.y = 0;
        player.position.y +=
            onFloor.target.absolutePosition.y -
            player.position.y -
            player.size.y -
            1;
    }

    // colision con la pared
    if (onWall.res) {
        if (
            onWall.target.absolutePosition.x < player.position.x &&
            playerVelocity.x < 0
        ) {
            playerVelocity.x = 0;
            player.position.x -=
                player.position.x -
                onWall.target.absolutePosition.x -
                onWall.target.size.x -
                1;
        } else if (
            onWall.target.absolutePosition.x > player.position.x &&
            playerVelocity.x > 0
        ) {
            playerVelocity.x = 0;
            player.position.x +=
                onWall.target.absolutePosition.x -
                player.position.x -
                player.size.x -
                1;
        }
    }

    if (collider.onArea().res) {
        // console.log("Area", collider.onArea().target);
        // GAME.stopGame();
    }

    // teletransportar
    if (Input.GetKeyDown("t")) player.changePosition(0, 0);

    // mover
    player.position = player.position.Sum(playerVelocity);
};

playerAnimator.play();

const playerContainer = new Object(
    GAME,
    GAME.w / 2 - 25,
    GAME.h / 2 - 175,
    200,
    200
);
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
        playerContainer._GAME.currentRoom.removeInstance(
            false,
            "playerContainer"
        );
    }
};

const node1 = new Object(GAME, 10, 0, 10, 10);
const node2 = new Object(GAME, 30, 0, 10, 10);
const node3 = new Object(GAME, 50, 0, 10, 10);
const node2_2 = new Object(GAME, 0, 20, 10, 10);
const node2_2Collider = new BoxCollider(GAME, 0, 0, 10, 10, 0, [], true);
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
const floorCollider = new BoxCollider(GAME, 0, 0, GAME.w, 10, 0, [], true);
const floor = new Object(GAME, 0, GAME.h - 75, GAME.w, 10);
floor.addChild(floorCollider, "floorCollider");

// -------------------------------------------------------------
// Wall
const wallCollider = new BoxCollider(GAME, 0, 0, 30, 100, 0, [], true);
const wall = new Object(GAME, 150, GAME.h - 175, 30, 100);
wall.addChild(wallCollider, "wallCollider");

// -------------------------------------------------------------
// Wall2
const wall2Collider = new BoxCollider(GAME, 0, 0, 30, 100, 0, [], true);
const wall2 = new Object(GAME, 240, GAME.h - 175, 30, 100);
wall2.addChild(wall2Collider, "wall2Collider");

const stopButton = new UIButton(
    GAME,
    10,
    GAME.h - 100,
    0,
    0,
    "STOP GAME",
    "16px monospace"
);
stopButton.onMouseDown = () => {
    GAME.stopGame();
};

let pauseButton = new UIButton(
    GAME,
    130,
    GAME.h - 100,
    0,
    0,
    "PAUSE",
    "16px monospace"
);
pauseButton.onMouseDown = () => {
    GAME.gamePaused ? GAME.playGame() : GAME.pauseGame();
    pauseButton.text = GAME.gamePaused ? "PLAY" : "PAUSE";
};

// TileMap1
let tileMap = new Tilemap(GAME, "./../tileMapTest.png", 32, 32);
for (let i = 0; i < GAME.w / 32; i++) {
    tileMap.addTile(32 * i, GAME.h - 60, 0, 0, 16, 16);
    tileMap.addTile(32 * i, GAME.h - 28, 16, 0, 16, 16);
}

// -------------------------------------------------------------
// Titulo
const title = new UILabel(GAME, 40, 20, GAME.w - 80, 60, "ROOM TEST");
title.align = "center";

const room1 = new Room(GAME, GAME.w * 2, GAME.h * 2, "Room1_test");
room1.tileMapLayer1 = tileMap;

room1.addInstance(stopButton, true, "stopButton");
room1.addInstance(pauseButton, true, "pauseButton");
room1.addInstance(node1, false, "node1");
room1.addInstance(node2, false, "node2");
room1.addInstance(node3, false, "node3");
room1.addInstance(floor, false, "floor");
room1.addInstance(wall, false, "wall");
room1.addInstance(wall2, false, "wall2");
room1.addInstance(playerContainer, false, "playerContainer");
room1.addInstance(title, "title");

GAME.addRoom(room1);
GAME.changeRoom("Room1_test", false);
GAME.startGame();

// console.log(room1);
// console.log(player._CHILDREN);
console.time();
console.log(
    "Se busco al objeto subNodo2 y el resultado fue: ",
    GAME.currentRoom.findByName("subNodo2") !== undefined
);
console.timeEnd();
