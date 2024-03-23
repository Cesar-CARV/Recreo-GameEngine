import Input from "./Input.js";
import UI from "./UI.js";

export default class UIInput extends UI {
  constructor(
    game,
    x,
    y,
    w,
    h,
    text,
    placeholder,
    fontSize = 16,
    bgColor = "#eee",
    bgColorHover = "#222",
    color = "#232323",
    colorHover = "#fff",
    colorPlaceHolder = "#aaa",
    padding = 16,
    border = true
  ) {
    super(game, x, y, w, h);

    this.text = [...text];
    this.placeholder = placeholder;
    this.fontSize = fontSize;
    this.backgroundColor = bgColor;
    this.bgHover = bgColorHover;
    this.bgNoHover = this.backgroundColor;
    this.color = color;
    this.colorHover = colorHover;
    this.colorNoHover = this.color;
    this.colorPlaceHolder = colorPlaceHolder;
    this.sizeUndefined = w === 0 && h === 0;
    // this.w = w;
    // this.h = h;

    this.padding = padding;
    this.border = border;
    this.textSize = 0;
    this.textIndex = 0;
  }

  onKeyDown = () => {
    let letters =
      "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNMñÑ,.-_;:[]{}''*+^¨°!|#$%&/()=?¡¿ ".split(
        ""
      );

    if (Input.GetKeyDown("ArrowLeft")) {
      this.textIndex += this.textIndex > 0 ? -1 : 0;
    }
    if (Input.GetKeyDown("ArrowRight")) {
      this.textIndex += this.textIndex < this.text.length ? 1 : 0;
    }
    if (Input.GetKeyDown("End")) {
      this.textIndex = this.text.length;
    }
    if (Input.GetKeyDown("Home")) {
      this.textIndex = 0;
    }
    if (Input.GetKeyDown("Backspace")) {
      this.textIndex += this.textIndex > 0 ? -1 : 0;
      this.text.splice(this.textIndex, 1);
    }

    letters.forEach((lett) => {
      if (Input.GetKeyDown(lett)) {
        this.text = [
          ...this.text.slice(0, this.textIndex),
          lett,
          ...this.text.slice(this.textIndex),
        ];
        this.textIndex++;
      }
    });
  };

  draw = (ctx) => {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

    if (this.border) {
      ctx.strokeStyle = "#000";
      ctx.strokeRect(
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y
      );
    }

    ctx.fillStyle = this.text.length === 0 ? this.colorPlaceHolder : this.color;
    ctx.font = `${this.fontSize}px monospace`;
    this.textSize =
      this.text.length === 0
        ? ctx.measureText(this.placeholder).width
        : ctx.measureText(this.text.join("")).width;
    ctx.fillText(
      this.text.length === 0 ? this.placeholder : this.text.join(""),
      this.position.x + this.padding,
      this.position.y + this.size.y / 2 + this.fontSize / 3
    );

    if (this.active) {
      let pointerX =
        this.position.x +
        (this.textSize / this.text.length) * this.textIndex +
        this.padding;
      ctx.fillStyle = this.color;
      ctx.fillRect(pointerX, this.position.y + 3, 3, this.size.y - 6);
    }
  };

  steps = () => {
    this.backgroundColor = this.hover ? this.bgHover : this.bgNoHover;
    this.color = this.hover ? this.colorHover : this.colorNoHover;

    if (this.sizeUndefined) {
      this.size.x = this.textSize + this.padding * 2;
    }

    if (this.sizeUndefined) {
      this.size.y = this.fontSize + this.padding;
    }
  };
}
