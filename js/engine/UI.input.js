import UI from './UI.js';

export default class UIInput extends UI {
    constructor(game, x, y, w, h, text, fontSize = 16, backgroundColor = "#eee", color = "#232323", padding = 16, border = true) {
        super(game, x, y, w, h);
        
        this.text = [...text];
        this.fontSize = fontSize;
        this.backgroundColor = backgroundColor;
        this.bgHover = "#ccc";
        this.bgNoHover = this.backgroundColor;
        this.color = color;
        this.padding = padding;
        this.textSize = 0;
        this.textIndex = 0;
        this.border = border;
        
        this.active = false;
    }

    onKeyDown = (e) => {
        let letters = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNMñÑ,.-_;:[]{}''*+^¨°!|#$%&/()=?¡¿"

        if (e.key === "Home") {
            this.textIndex = 0;
        }
        if (e.key === "End") {
            this.textIndex = this.text.length;
        }
        if (e.key === "ArrowLeft") {
            this.textIndex += this.textIndex > 0 ? -1 : 0;
        }
        if (e.key === "ArrowRight") {
            this.textIndex += this.textIndex < this.text.length ? 1 : 0;
        }
        if (e.key === "Backspace") {
            this.textIndex += this.textIndex > 0 ? -1 : 0;
            this.text.splice(this.textIndex, 1);
        }
        if (e.key === " ") {
            this.text = [...this.text.slice(0, this.textIndex), " ", ...this.text.slice(this.textIndex)];
            this.textIndex++;
        }

        if (letters.includes(e.key) &&
            e.key !== "ArrowLeft" && e.key !== "ArrowRight" &&
            e.key !== "ArrowUp" && e.key !== "ArrowDown"
        ){
            this.text = [...this.text.slice(0, this.textIndex), e.key, ...this.text.slice(this.textIndex)];
            this.textIndex++;
        }
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
        this.textSize = ctx.measureText(this.text.join('')).width;
        ctx.fillText(this.text.join(''), (this.x + this.hitBox.w / 2) - (this.textSize / 2), this.y + this.hitBox.h / 2 + this.fontSize / 3);

        if (this.active) {
            let pointerX = this.x + this.textSize / this.text.length * this.textIndex + this.padding; 
            ctx.fillStyle = this.color;
            ctx.fillRect(pointerX, this.y + 3, 3, this.hitBox.h - 6);
        }

    }

    steps = (ctx) => {
        this.backgroundColor = this.hover ? this.bgHover : this.bgNoHover;  

        if (this.w === 0) {
            this.hitBox.w = this.textSize + this.padding * 2;
        }

        if (this.h === 0) {
            this.hitBox.h = this.fontSize + this.padding;
        }
    }

}