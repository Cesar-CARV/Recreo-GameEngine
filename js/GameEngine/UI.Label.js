import UI from "./UI.js";

export default class UILabel extends UI {
  constructor(
    game,
    x,
    y,
    w,
    h,
    text,
    font = "16px san-serif",
    backgroundColor = "#eee0",
    color = "#232323",
    padding = 16,
    border = false
  ) {
    super(game, x, y, w, h);

    this.text = text;
    this.font = font;
    this.backgroundColor = backgroundColor;
    this.color = color;
    this.padding = padding;
    this.border = border;
    this.textSize = 0;
  }

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

    ctx.fillStyle = this.color;
    ctx.font = this.font;
    const fontSplited = this.font.split('');
    let fontSize = fontSplited.length === 2 ? fontSplited[0] : fontSplited[1];
    let fontSizeNumber = fontSize.substr(0, -2);
    this.textSize = ctx.measureText(this.text).width;
    ctx.fillText(
      this.text,
      this.position.x + this.size.x / 2 - this.textSize / 2,
      this.position.y + this.size.y / 2 + fontSizeNumber / 3
    );
  };

  steps = () => {
    const fontSplited = this.font.split('');
    let fontSize = fontSplited.length === 2 ? fontSplited[0] : fontSplited[1];
    let fontSizeNumber = fontSize.substr(0, -2);

    this.size.x = this.textSize + this.padding * 2;
    this.size.y = fontSizeNumber + this.padding;
  };
}
