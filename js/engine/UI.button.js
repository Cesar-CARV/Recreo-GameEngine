import UI from './UI.js';

export default class UIButton extends UI {
    constructor(game, x, y, w, h, text, fontSize = 16, bgColor = "#eee", bgColorHover = "#222", color = "#232323", colorHover = "#fff", padding = 16, border = true) {
        super(game, x, y, w, h);
        
        this.text = text;
        this.fontSize = fontSize;
        this.backgroundColor = bgColor;
        this.bgHover = bgColorHover;
        this.bgNoHover = this.backgroundColor;
        this.color = color;
        this.colorHover = colorHover;
        this.colorNoHover = this.color;

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
        this.backgroundColor = this.hover ? this.bgHover : this.bgNoHover;
        this.color = this.hover ? this.colorHover : this.colorNoHover;

        if (this.w === 0) {
            this.hitBox.w = this.textSize + this.padding * 2;
        }

        if (this.h === 0) {
            this.hitBox.h = this.fontSize + this.padding;
        }
    }

}