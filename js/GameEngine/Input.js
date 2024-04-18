export default class Input {

    static GetKeyDown = (key) => {
        let down = this.keydown.has(key);
        this.keydown.delete(key);
        return down;
    }

    static GetKeyPress = (key) => {
        return this.keypress.has(key);
    }

    static GetKeyUp = (key) => {
        let up = this.keyup.has(key);
        this.keyup.delete(key);
        return up;

    }
    static GetMouseDown = (button) => {
        let down = this.mousedown.has(button);
        this.mousedown.delete(button);
        return down;
    }
    
    static GetMouseUp = (button) => {
        let up = this.mouseup.has(button);
        this.mouseup.delete(button);
        return up;
    }

    static GetMouseCords = () => {
        return this.mouseCord;
    }


    static _OnKeyDown = (e) => {
        this.keydown.add(e.key);
        this.keypress.add(e.key)
        this.keyup.delete(e.key);
    }
    static _OnKeyUp = (e) => {
        this.keyup.add(e.key);
        this.keydown.delete(e.key);
        if (this.keypress.has(e.key)) this.keypress.delete(e.key);
    }
    static _OnMouseDown = (e) => {
        this.mousedown.add(e.button);
        this.mouseup.delete(e.button);
    }
    static _OnMouseUp = (e) => {
        this.mouseup.add(e.button);
        this.mousedown.delete(e.button);
    }
    static _OnMouseMove = (e) => {
        this.mouseCord =  {x: e.offsetX - e.target.style.left, y: e.offsetY - e.target.style.top};
    }

    static Init(target) {
        if (!target) return;

        target.addEventListener("keydown", Input._OnKeyDown.bind(this));
        target.addEventListener("keyup", Input._OnKeyUp.bind(this));
        target.addEventListener("mousedown", Input._OnMouseDown.bind(this));
        target.addEventListener("mouseup", Input._OnMouseUp.bind(this));
        target.addEventListener("mousemove", Input._OnMouseMove.bind(this));
        target.addEventListener("contextmenu", (e) => e.preventDefault());
        target.addEventListener("blur", (e) => {
            Input.keydown.clear();
            Input.keypress.clear();
            Input.mousedown.clear();
            Input.mouseup.clear();
        });
    }

}

Input.keydown = new Set();
Input.keypress = new Set();
Input.keyup = new Set();
Input.mousedown = new Set();
Input.mouseup = new Set();
Input.mouseCord = {x:0, y:0};