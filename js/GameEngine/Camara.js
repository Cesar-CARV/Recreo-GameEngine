export default class Camara {
    constructor(GAME, room, ctx, x, y, w, h, target = undefined, border = false){
        this.GAME = GAME;
        this.room = room;
        this.ctx = ctx;
        this.absoluteX = x;
        this.absoluteY = y;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.target = target;
        this.border = border;
        this.MODES = {Center: "Center", Borders: "Borders"};
        this.mode = this.MODES.Center;
    }

    clearCamara = () => {
        // clip camara
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.GAME.w, this.GAME.h);
        this.ctx.clip();
        
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.GAME.w, this.GAME.h);

        // clip camara
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.w, this.h);
        this.ctx.clip();

        this.ctx.clearRect(0, 0, this.room.w, this.room.h);
    }

    moveCamara = () => {
        if (this.target) {
            if (this.mode === this.MODES.Center) {
                // move x to center
                if (this.target.x + this.target.w / 2 > this.w / 2 || this.target.x + this.target.w / 2 < this.w / 2) {
                    //if (this.room.w >= this.GAME.w) {
                        this.x = this.target.x + this.target.w / 2 - this.w / 2;
                    //};
                }
                // move y to center
                if (this.target.y + this.target.h / 2 > this.h / 2 || this.target.y + this.target.h / 2 < this.h / 2) {
                    //if (this.room.h >= this.GAME.h) {
                        this.y = this.target.y + this.target.h / 2 - this.h / 2;
                    //}
                }
                
                // collitions center
                if (this.x < 0) this.x = 0;
                else if (this.x + this.w > this.room.w) this.x = this.room.w - this.w;
                if (this.y < 0) this.y = 0;
                else if (this.y + this.h > this.room.h) this.y = this.room.h - this.h;
            }
            else if (this.mode === this.MODES.Borders) {
                // move directions
                const dirX = Math.sign(-1 * (this.x + this.w - this.target.x - this.target.w));
                const dirY = Math.sign(-1 * (this.y+ this.h - this.target.y - this.target.h));

                // move x to border right
                if (this.target.x + this.target.w > this.w && this.x + this.w < this.room.w && dirX > 0) {
                    this.x = this.target.x + this.target.w - this.w;
                }
                else if (this.target.x < this.x && this.x > 0) {
                    this.x = this.target.x;
                }
                
                // move x to border left
                if (this.target.y + this.target.h > this.h && this.y + this.h < this.room.h && dirY > 0) {
                    this.y = this.target.y + this.target.h - this.h;
                }
                else if (this.target.y < this.y && this.y > 0) {
                    this.y = this.target.y;
                }
            }
        }

        // move camara
        this.ctx.translate(this.absoluteX - this.x, this.absoluteY - this.y);
    }

    resetCamara = () => {
        // Reset current transformation matrix to the identity matrix
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    steps = () => {
        if (this.border){
            this.ctx.strokeStyle = "#f00";
            this.ctx.strokeRect(this.absoluteX, this.absoluteY, this.w, this.h);
            
            this.ctx.strokeStyle = "#00f";
            this.ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }

    render = (instance) => {
        // execute instance main
        instance.main(this.ctx);
    }
}