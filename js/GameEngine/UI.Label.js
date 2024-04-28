import UI from "./UI.js";
import Vector2 from "./Vector2.js";

export default class UILabel extends UI {
    constructor(game, x, y, w, h, text) {
        super(game, x, y, w, h);

        this.text = text;
        this.font = "16px san-serif";
        this.backgroundColor = "#000";
        this.color = "#aaa";
        this.fill = false;
        this.border = false;
        this.align = "left";
        this.textMetrics = new Vector2(0, 0);
    }

    draw = (ctx) => {
        ctx.font = this.font;
        this.textMetrics.x = Math.ceil(ctx.measureText(this.text).width);
        this.textMetrics.y = Math.ceil(
            ctx.measureText(this.text).hangingBaseline
        );

        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y
        );

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
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
                this.position.y + this.textMetrics.y / 2 + this.size.y / 4,
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
}
