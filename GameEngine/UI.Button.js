import UI from "./UI.js";
import Vector2 from "./Vector2.js";

export default class UIButton extends UI {
  /**
   * 
   * @param {object} GAME 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   * @param {string} text 
   */
  constructor(GAME, x, y, w, h, text) {
    super(GAME, x, y, w, h);
    
    this.container = false;
    this.text = text;
    this.font = "16px sans-serif";
    this.backgroundColor = "#aaa";
    this.color = "#222";
    this.fill = true;
    this.border = false;
    this.borderWeight = 1;
    this.borderColor = "#000";
    this.align = "center";
    this.textMetrics = new Vector2(0, 0);

    this.backgroundColorHover = "#0ea5e9";
    this.colorHover = "#fff";
    this.borderColorHover = "#000";
    this.backgroundColorPressed = "#0089C6";
    this.colorPressed = "#6BC8F2";
    this.borderColorPressed = "#000";
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @returns 
   */
  drawBody = (ctx) => {
    // boton body
    if (this.hover && !this.pressed) {
      ctx.fillStyle = this.backgroundColorHover;
    } else if (this.hover && this.pressed) {
      ctx.fillStyle = this.backgroundColorPressed;
    } else {
      ctx.fillStyle = this.backgroundColor;
    }
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

    // boton border
    if (!this.border) return;

    if (this.hover && !this.pressed) {
      ctx.strokeStyle = this.borderColorHover;
    } else if (this.hover && this.pressed) {
      ctx.strokeStyle = this.borderColorPressed;
    } else {
      ctx.strokeStyle = this.borderColor;
    }
    ctx.lineWidth = this.borderWeight;
    ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.size.x, this.size.y);
    ctx.clip();

    ctx.font = this.font;
    this.textMetrics.x = Math.ceil(ctx.measureText(this.text).width);
    this.textMetrics.y = Math.ceil(ctx.measureText(this.text).hangingBaseline);

    this.drawBody(ctx);

    // texto
    if (this.hover && !this.pressed) {
      ctx.fillStyle = this.colorHover;
      ctx.strokeStyle = this.colorHover;
    } else if (this.hover && this.pressed) {
      ctx.fillStyle = this.colorPressed;
      ctx.strokeStyle = this.colorPressed;
    } else {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
    }

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
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2
      );
    } else {
      ctx.strokeText(
        this.text,
        this.position.x + textAlign,
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2
      );
    }
    ctx.restore();
  };
}
