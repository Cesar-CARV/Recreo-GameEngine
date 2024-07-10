export default class KeyFrame {
  /**
   * 
   * @param {number} cutX 
   * @param {number} cutY 
   * @param {number} cutW 
   * @param {number} cutH 
   * @param {number} tileWidth 
   * @param {number} tileHeight 
   */
  constructor(cutX, cutY, cutW, cutH, tileWidth, tileHeight) {
    this.cutX = cutX;
    this.cutY = cutY;
    this.cutW = cutW;
    this.cutH = cutH;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }
}
