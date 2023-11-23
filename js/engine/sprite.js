
export default class Sprite{
    constructor(parent, x, y, w, h, url){
        this.parent = parent;
        this.x = parent.x + x;
        this.y = parent.y + y;
        this.ofSetX = x;
        this.ofSetY = y;
        this.w = w;
        this.h = h;
        
        this.canDraw = false;
        this.img = new Image(w, h);
        this.img.onload = () => {
            this.canDraw = true;
        };
        this.img.src = url;

        this.frame = 0;
        this.frameLimit = 0;
        this.time = 0;
        this.cells = [];
        this.cellWidth = 0;
        this.cellHeight = 0;
        this.gridCols = 0;
        this.gridRows = 0;
        this.animationLoop = false;
        this.ofSetCellX = 0;
        this.ofSetCellY = 0;
        this.repeat = true;
        this.animationEnds = undefined;
    }

    #resetVals = () => {
        this.frame = 0;
        this.frameLimit = 0;
        this.time = 0;
        this.cells = [];
        this.cellWidth = 0;
        this.cellHeight = 0;
        this.gridCols = 0;
        this.gridRows = 0;
        this.animationLoop = false;
        this.ofSetCellX = 0;
        this.ofSetCellY = 0;
    }


    setGrid = (cols, rows, cellW, cellH) => {
        this.gridCols = cols;
        this.gridRows = rows;
        this.cellWidth = cellW;
        this.cellHeight = cellH;
        this.frameLimit = cols * rows - 1;

        for (let i = 0; i < rows; i++){
            for (let j = 0; j < cols; j++){
                let x = j * cellW > cellW * cols ? 0 : j * cellW;
                let y = i * cellH > cellH * rows ? 0 : i * cellH;
                this.cells.push({X: x, Y: y});
            }
        }
    }

    changeSprite = (url, repeat, time) => {
        const lastTime = this.time
        this.#resetVals();

        this.img.src = url;
        this.repeat = repeat;
        this.time = !time ? lastTime : time;
    }

    stopAnimation = () => {
        clearInterval(this.animationLoop);
        if (this.animationEnds) this.animationEnds();
    }

    startAnimation = (time = 1000 / 2, frame) => {
        this.frame = frame > this.frameLimit ? this.frameLimit : frame;
        this.time = time;
        this.animationLoop = setInterval(() => {
            if (this.repeat) this.frame = this.frame >= this.frameLimit ? 0 : this.frame + 1;
            else this.frame = this.frame < this.frameLimit ? this.frame + 1 : this.frame;

            if (!this.repeat && this.frame >= this.frameLimit) this.stopAnimation();
        }, this.time);
    }

    draw = (ctx) => {
        if (this.canDraw){
            if (this.cellWidth !== 0 && this.cellHeight !== 0 && this.gridCols !== 0 && this.gridRows !== 0) {
                    ctx.drawImage(
                    this.img, // image
                    this.cells[this.frame].X, // cut x
                    this.cells[this.frame].Y, // cut y
                    this.cellWidth, // cut w
                    this.cellHeight, // cut h
                    this.x, // image x
                    this.y, // image y
                    this.w, // image w
                    this.h // image h
                );
            }
            else {
                ctx.drawImage(this.img, this.x, this.y, this.w * 2, this.h * 3);
            }
        };
    }

    main = (ctx) => {
        if (this.img.src === '') return;

        this.draw(ctx);
        this.x = this.parent.x + this.ofSetX;
        this.y = this.parent.y + this.ofSetY;
    }
}