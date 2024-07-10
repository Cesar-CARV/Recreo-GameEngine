import Time from "./Time.js";

export default class Clock {
  /**
   * 
   * @param {object} GAME 
   * @param {number} time 
   * @param {boolean} repeat 
   */
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
    this.current = 0;
    this.oldSec = -1;
  };

  reset = () => {
    this.finished = false;
    this.current = 0;
    this.oldSec = -1;
  }

  start = () => {
    this.runing = true;
  };

  pause = () => {
    this.runing = false;
  };

  /**
   * 
   * @param {requestCallback} callback 
   * @returns 
   */
  tick = (callback) => {
    if (!this.runing) return;

    let DT = new Date().getMilliseconds();

    if (DT !== this.oldSec) {
      this.current += Time.deltaTime < 1 ? Time.deltaTime : 0;
      this.oldSec = DT
    }

    if (this.current >= this.time) {
      if (callback) callback();
      if (this.repeat) this.restart();
      else {
        this.pause();
        this.finished = true;
      }
    }
  };
}
