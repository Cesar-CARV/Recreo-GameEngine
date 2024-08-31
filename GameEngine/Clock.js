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
    this.running = false;
    this.finished = false;
    this.oldSec = -1;
  }

  restart = () => {
    this.finished = false;
    this.current = 0;
    this.oldSec = -1;
  };

  start = () => {
    this.running = true;
  };

  pause = () => {
    this.running = false;
  };

  /**
   * 
   * @param {requestCallback} callback 
   * @returns 
   */
  tick = (callback, deltaTime) => {
    if (!this.running) return;

    let DT = new Date().getMilliseconds();

    if (DT !== this.oldSec) {
      this.current += deltaTime < 1 ? deltaTime : 0;
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
