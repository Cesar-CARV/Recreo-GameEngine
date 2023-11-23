export default class Display {
    constructor(canvas, input, w, h){
        this.CANVAS = canvas;
        this.INPUT = input;
        this.w = w;
        this.h = h;

        this.resize(w, h);
    }

    resize = (w, h) => {
        this.CANVAS.width = w;
        this.CANVAS.height = h;

        this.INPUT.style.width = w + 2.22 + "px";
        this.INPUT.style.height = h + 2.22 + "px";
    }


}