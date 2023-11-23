import UI from './UI.js';

export default class UILabel extends UI {
    constructor(game, x, y, w, h, text, fontSize = 16, backgroundColor = "#eee0", color = "#232323", padding = 16, border = false) {
        super(game, x, y, w, h);
        
        this.text = text;
        this.fontSize = fontSize;
        this.backgroundColor = backgroundColor;
        this.color = color;
        this.padding = padding;
        this.border = border;
        this.textSize = 0;
    }

    draw = (ctx) => {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.hitBox.w, this.hitBox.h);
        
        if (this.border){
            ctx.strokeStyle = "#000";
            ctx.strokeRect(this.x, this.y, this.hitBox.w, this.hitBox.h);
        }

        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}px monospace`;
        this.textSize = ctx.measureText(this.text).width;
        ctx.fillText(this.text, (this.x + this.hitBox.w / 2) - (this.textSize / 2), this.y + this.hitBox.h / 2 + this.fontSize / 3);

    }

    steps = (ctx) => {
        this.hitBox.w = this.textSize + this.padding * 2;
        this.hitBox.h = this.fontSize + this.padding;
    }

}