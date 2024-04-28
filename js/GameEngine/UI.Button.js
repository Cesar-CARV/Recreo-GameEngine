import UI from "./UI.js";
import Vector2 from "./Vector2.js";

export default class UIButton extends UI {
    constructor(game, x, y, w, h, text) {
        super(game, x, y, w, h);

        this.text = text;
        this.font = "16px sans-serif";
        this.backgroundColor = "#aaa";
        this.color = "#222";
        this.fill = true;
        this.border = false;
        this.align = "left";
        this.textMetrics = new Vector2(0, 0);

        this.backgroundColorHover = "#0ea5e9";
        this.colorHover = "#fff";
    }

    draw = (ctx) => {
        ctx.font = this.font;
        this.textMetrics.x = Math.ceil(ctx.measureText(this.text).width);
        this.textMetrics.y = Math.ceil(
            ctx.measureText(this.text).hangingBaseline
        );

        ctx.fillStyle = this.hover
            ? this.backgroundColorHover
            : this.backgroundColor;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y
        );

        ctx.fillStyle = this.hover ? this.colorHover : this.color;
        ctx.strokeStyle = this.hover ? this.colorHover : this.color;
        let textAlign =
            this.align === "center"
                ? this.size.x / 2 - this.textMetrics.x / 2
                : this.align === "right"
                ? this.size.x - this.textMetrics.x
                : 0;
        if (this.fill) {
            ctx.fillText(
                this.text,
                this.position.x + textAlign,
                this.position.y + this.textMetrics.y / 2 + this.size.y / 2,
                this.size.x
            );
        } else {
            ctx.strokeText(
                this.text,
                this.position.x + textAlign,
                this.position.y + this.textMetrics.y / 2 + this.size.y / 2,
                this.size.x
            );
        }
    };

    // steps = () => {
    //     this.backgroundColor = this.hover ? this.bgHover : this.bgNoHover;
    //     this.color = this.hover ? this.colorHover : this.colorNoHover;

    //     const fontSplited = this.font.split('');
    //     let fontSize = fontSplited.length === 2 ? fontSplited[0] : fontSplited[1];
    //     let fontSizeNumber = fontSize.substr(0, -2);

    //     if (this.size.x === 0 && this.textSize !== 0) {
    //         this.size.x = this.textSize + this.padding * 2;
    //     }

    //     if (this.size.y === 0 && this.textSize !== 0) {
    //         this.size.y = fontSizeNumber + this.padding * 2;
    //     }
    // };
}
