import {Child} from './Child';

export class Face {
  public solid = true;
  x: number;
  y: number;
  width: number;
  height: number;
  toBlur: boolean;
  child: Child;

  constructor(x: number, y: number, width: number, height: number, toBlur: boolean, child: Child) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.toBlur = toBlur;
    this.child = child;
  }
}