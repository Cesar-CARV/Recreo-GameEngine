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
        this.nIY = 0;
        this.nIX = 0;
        this.mode = this.CAMMODES.Center;
        this.lastTargX = 0;
        this.lastTargY = 0;
    }

    setTarget = (target) => this.target = target;

    main = (ctx, instance) => {
        const targX = this.target.x - this.x;
        const targY = this.target.y - this.y;
        const speedTargetX = Math.abs(targX - this.lastTargX);
        const speedTargetY = Math.abs(targY - this.lastTargY);

        this.lastTargX = targX;
        this.lastTargY = targY;

        if (this.mode === this.CAMMODES.Limits) {
            if (targX + this.target.w > this.GAME.display.w && this.x + this.w < this.room.w) this.x += speedTargetX;
            else if (targX < 0 && this.x > 0) this.x -= speedTargetX;

            if (targY + this.target.h > this.GAME.display.h && this.y + this.h < this.room.h) this.y += speedTargetY;
            else if (targY < 0 && this.y > 0) this.y -= speedTargetY;
        }
        else if (this.mode === this.CAMMODES.Center) {
            if (targX > this.GAME.display.w / 2 && this.x + this.w < this.room.w) this.x += speedTargetX;
            else if (targX < this.GAME.display.w / 2 && this.x > 0) this.x -= speedTargetX;

            if (targY > this.GAME.display.h / 2 && this.y + this.h < this.room.h) this.y += speedTargetY;
            else if (targY < this.GAME.display.h / 2 && this.y > 0) this.y -= speedTargetY;
        }

        this.nIY = instance.y - this.y;
        this.nIX = instance.x - this.x;
        if (instance.x + instance.w > this.x && instance.x < this.x + this.w && 
            instance.y + instance.h > this.y && instance.y < this.y + this.h) {

            instance.draw(ctx, this.nIX, this.nIY);
            instance.sprite.main(ctx, this.nIX, this.nIY)
            
            //ctx.fillStyle = "#f00";
            //ctx.fillRect(this.nIX, this.nIY, 5, 5);
        }
    }
}