export default class Camara{
    CAMMODES = {Limits: "Limits", Center: "Center"}
    constructor(game, room, target = undefined){
        this.room = room;
        this.GAME = game;
        this.x = 0;
        this.y = 0;
        this.w = game.display.w;
        this.h = game.display.h;
        this.target = target;
        this.mode = this.CAMMODES.Center;
        this.targX = 0;
        this.targY = 0;
        this.speedTargetX = Math.abs(this.targX - this.lastTargX);
        this.speedTargetY = Math.abs(this.targY - this.lastTargY);
        this.lastTargX = 0;
        this.lastTargY = 0;
    }

    setTarget = (target) => this.target = target;

    calculatePosCamara = (ctx) => {
        this.targX = this.target.x - this.x;
        this.targY = this.target.y - this.y;
        this.speedTargetX = Math.abs(this.targX - this.lastTargX);
        this.speedTargetY = Math.abs(this.targY - this.lastTargY);

        if (this.mode === this.CAMMODES.Limits) {
            if (this.targX + this.target.w > this.GAME.display.w && this.x + this.w < this.room.w) {this.x += this.speedTargetX;}
            else if (this.targX < 0 && this.x > 0) {this.x -= this.speedTargetX;}

            if (this.targY + this.target.h > this.GAME.display.h && this.y + this.h < this.room.h) {this.y += this.speedTargetY;}
            else if (this.targY < 0 && this.y > 0) {this.y -= this.speedTargetY;}
        }
        else if (this.mode === this.CAMMODES.Center) {
            if (this.targX > this.GAME.display.w / 2 && this.x + this.w < this.room.w) {this.x += this.speedTargetX;}
            else if (this.targX < this.GAME.display.w / 2 && this.x > 0) {this.x -= this.speedTargetX;}

            if (this.targY > this.GAME.display.h / 2 && this.y + this.h < this.room.h) {this.y += this.speedTargetY;}
            else if (this.targY < this.GAME.display.h / 2 && this.y > 0) {this.y -= this.speedTargetY;}
        }

        this.lastTargX = this.targX;
        this.lastTargY = this.targY;
    }

    drawInstanceOnCamara = (ctx, instance) => {
        const nIY = instance.y - this.y;
        const nIX = instance.x - this.x;
        
        if (instance.x + instance.w > this.x && instance.x < this.x + this.w && 
            instance.y + instance.h > this.y && instance.y < this.y + this.h) {

            instance.draw(ctx, nIX, nIY);
            instance.sprite.main(ctx, nIX, nIY)
        }
    }
}