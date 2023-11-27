export default class Camara{
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
    }

    setTarget = (target) => this.target = target;

    main = (ctx, instance) => {
        //ctx.fillStyle = "#6af1";
        //ctx.fillRect(this.x, this.y, this.w, this.h);

        const targX = this.target.x - this.x;
        const targY = this.target.y - this.y;

        if (targX + this.target.w > this.GAME.display.w && this.x + this.w < this.room.w) {
            this.x ++;
        }
        else if (targX < 0 && this.x > 0) {
            this.x --;
        }
        if (targY + this.target.h > this.GAME.display.h && this.y + this.h < this.room.h) {
            this.y ++;
        }
        else if (targY < 0 && this.y > 0) {
            this.y --;
        }

        this.nIY = instance.y - this.y;
        this.nIX = instance.x - this.x;
        if (instance.x + instance.w > this.x && instance.x < this.x + this.w && 
            instance.y + instance.h > this.y && instance.y < this.y + this.h) {

            instance.draw(ctx, this.nIX, this.nIY);
            instance.sprite.main(ctx, this.nIX, this.nIY)
            
            ctx.fillStyle = "#f00";
            ctx.fillRect(this.nIX, this.nIY, 5, 5);
        }
    }
}