import Obj from "./engine/object.js";
import Sprite from "./engine/sprite.js";

export default class Bird extends Obj {
    constructor(game, x, y, w, h){
        super(game, x, y, w, h);
        this.speedV = 0;
        this.speedH = 0;
        this.gravity = .5;
        this.jump = -7;
        this.speedLimit = 16;
        this.fall = true;
        this.hit = false;
        //this.hitBox.show = true;

        this.moveL = false;
        this.moveR = false;

        this.sprite.img.src = "./../spriteTest.png";
        this.sprite.setGrid(3, 4, 16, 16);
        this.sprite.startAnimation(100, 0);
        this.sprite.repeat = true;
        
    }

    restartValues = () => {
        this.x = this.GAME.display.w / 2 - 15;
        this.y = this.GAME.display.h / 2 - 15;
        this.moveL = false;
        this.moveR = false;
        this.speedV = 0;
        this.sprite.img.src = "./../spriteTest.png";
        this.sprite.setGrid(3, 4, 16, 16);
        this.sprite.startAnimation(100, 0);
        this.sprite.animationEnds = undefined;
        this.sprite.repeat = true;
        this.hit = false;
    }

    draw = (ctx, dX, dY) => {
    }

    onMouseDown = (e) => {
        this.speedV = this.jump;
    } 

    onKeyDown = (e) => {
        if (e.key === "w") this.speedV = this.jump;
        if (e.key === "d") {this.moveR = true; this.moveL = false;}
        else if (e.key === "a") {this.moveL = true; this.moveR = false;}
    }

    onKeyUp = (e) => {
        if (e.key === " ") return;
        if (e.key === "d") this.moveR = false;
        else if (e.key === "a") this.moveL = false;
    }

    collitions = (ctx) => {
        let [isCol, instances] = this.GAME.isCollition(this);
        
        this.fall = this.GAME.isFreeDown(this)[0];

        if (isCol === true){
            instances.forEach(inst => {

                if (inst.constructor["name"] === "Obj") {
                    if (!this.fall) {
                        this.speedV = this.speedV > 0 ? 0 : this.speedV;
                        this.y = inst.hitBox.y - this.hitBox.h;
                    }
                }

                if (inst.constructor["name"] === "Wall") {
                    this.hit = true;
                    this.sprite.stopAnimation();
                    this.sprite.changeSprite("./../spriteTest2.png", false);
                    this.sprite.setGrid(3, 3, 16, 16);
                    this.sprite.startAnimation(100, 0);
                    this.sprite.animationEnds = () => {
                        let resetGameButton = this.GAME.findByQuery("UIButton",[{key:"text", value:"Reset Game ⏱️"}])[0];

                        if (!resetGameButton) return;
        
                        this.GAME.pauseGame = true;
                        resetGameButton.visible = true;
                        resetGameButton.x = this.GAME.display.w / 2 - resetGameButton.hitBox.w / 2;
                    }
                }
            });
        }


    }

    steps = (ctx) => {
        if (this.hit) return;

        this.collitions(ctx);

        // gravedad
        if (this.fall){
            if (this.speedV < this.speedLimit) {
                this.speedV += this.gravity;
            }
        }

        // movimiento
        if (this.moveL) this.speedH = -5;
        else if (this.moveR) this.speedH = 5;
        else if (!this.moveR && !this.moveL) this.speedH = 0; 

        this.y += this.speedV;
        this.x += this.speedH;

    }
}