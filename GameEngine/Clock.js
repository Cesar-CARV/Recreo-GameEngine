import Time from "./Time.js";

export default class Clock {
  constructor(GAME, time, repeat) {
    this._GAME = GAME;
    this.time = time;
    this.repeat = repeat;
    this.current = 0;
    this.runing = false;
    this.finished = false;
    this.oldSec = -1;
  }

  restart = () => {
    this.finished = false;
    this.current = undefined;
    this.pause();
    this.start();
  };

  start = () => {
    if (this.runing) return;
    this.runing = true;
  };

  pause = () => {
    this.runing = false;
  };

  tick = (callback) => {
    if (!this.runing) return;

    let DT = new Date().getMilliseconds();

    if (DT !== this.oldSec) {
      this.current += Time.deltaTime < 1 ? Time.deltaTime : 0;
      this.oldSec = DT
    }
    
    if (this.current >= this.time) {
      this.pause();
      if (callback) callback();
      if (this.repeat) this.start();
    }
  };
}
