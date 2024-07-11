import Input from "./Input.js";
import UI from "./UI.js";
import Vector2 from "./Vector2.js";

export default class UIInput extends UI {
  /**
   * 
   * @param {object} GAME 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   * @param {string} text 
   * @param {string} placeholder 
   */
  constructor(GAME, x, y, w, h, text = "", placeholder = "placeholder") {
    super(GAME, x, y, w, h);

    this.container = false;
    this.text = text;
    this.maxTextLength = 50;
    this.placeholder = placeholder;
    this.font = "16px sans-serif";
    this.placeholderColor = "#555";
    this.backgroundColor = "#aaa";
    this.colorPointer = "#000";
    this.pointer = 0;
    this.color = "#222";
    this.fill = true;
    this.border = false;
    this.activeBorderColor = "#0ea5e9";
    this.textMetrics = new Vector2(0, 0);

    this.backgroundColorHover = "#0ea5e9";
    this.colorHover = "#fff";
  }

  onKeyDown = () => {
    let letters =
      "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNMñÑ,.-_;:[]{}''*+^¨°!|#$%&/()=?¡¿ ".split(
        ""
      );

    if (Input.GetKeyDown("ArrowLeft")) {
      this.pointer += this.pointer > 0 ? -1 : 0;
    }
    if (Input.GetKeyDown("ArrowRight")) {
      this.pointer += this.pointer < this.text.length ? 1 : 0;
    }
    if (Input.GetKeyDown("End")) {
      this.pointer = this.text.length;
    }
    if (Input.GetKeyDown("Home")) {
      this.pointer = 0;
    }
    if (Input.GetKeyDown("Backspace")) {
      this.text = this.text
        .split("")
        .filter((x, i) => (i === this.pointer - 1 ? "" : x))
        .join("");
      this.pointer += this.pointer > 0 ? -1 : 0;
    }

    letters.forEach((lett) => {
      if (this.text.length >= this.maxTextLength) return;

      if (Input.GetKeyDown(lett)) {
        if (this.text === "") {
          this.text += lett;
          this.pointer++;
        } else if (this.pointer === 0) {
          this.text = lett + this.text;
          this.pointer++;
        } else {
          this.text = this.text
            .split("")
            .map((x, i) => (i === this.pointer - 1 ? x + lett : x))
            .join("");
          this.pointer++;
        }
      }
    });
  };

  onBlur = () => {
    this.pointer = 0;
  };

  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.size.x, this.size.y);
    ctx.clip();

    ctx.font = this.font;
    this.textMetrics.x = Math.ceil(ctx.measureText(this.text).width);
    this.textMetrics.y = Math.ceil(ctx.measureText(this.text).hangingBaseline);

    ctx.fillStyle = this.hover
      ? this.backgroundColorHover
      : this.backgroundColor;
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

    // overflow
    let overflow = 0;
    if (
      ctx.measureText(this.text.substr(0, this.pointer)).width > this.size.x
    ) {
      overflow =
        ctx.measureText(this.text.substr(0, this.pointer)).width - this.size.x;
    }

    // pointer y active border
    if (this.active) {
      // active border
      ctx.strokeStyle = this.activeBorderColor;
      ctx.strokeRect(
        this.position.x + 1,
        this.position.y + 1,
        this.size.x - 2,
        this.size.y - 2
      );

      // pointer
      ctx.fillStyle = this.colorPointer;
      ctx.fillRect(
        this.position.x +
          ctx.measureText(this.text.substr(0, this.pointer)).width -
          overflow,
        this.position.y + this.size.y / 6,
        2,
        this.size.y - this.size.y / 3
      );
    }

    //  texto
    if (this.text.length > 0) {
      ctx.fillStyle = this.hover ? this.colorHover : this.color;
    } else {
      ctx.fillStyle = this.placeholderColor;
    }
    ctx.strokeStyle = this.hover ? this.colorHover : this.color;

    if (this.fill) {
      ctx.fillText(
        this.text.length === 0 ? this.placeholder : this.text,
        this.position.x - overflow,
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2
      );
    } else {
      ctx.strokeText(
        this.text.length === 0 ? this.placeholder : this.text,
        this.position.x - overflow,
        this.position.y + this.textMetrics.y / 2 + this.size.y / 2
      );
    }
    ctx.restore();
  };
}
