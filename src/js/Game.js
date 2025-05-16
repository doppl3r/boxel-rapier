import { Assets } from './Assets.js';
import { Scene } from './Scene.js';
import { Interval } from './Interval.js';

class Game {
  constructor() {
    this.assets = new Assets();
    this.scene = new Scene();
    this.interval = new Interval();

    // TODO: Remove test
    this.start();
    console.log(this.scene);
  }

  update(delta, alpha, frame ) {
    console.log(delta, alpha, frame);
  }
  
  render(delta, alpha, frame) {
    //console.log(delta, alpha, frame);
  }

  start() {
    this.interval.add((delta, alpha, frame) => this.update(delta, alpha, frame), 1000 / 1);
    this.interval.add((delta, alpha, frame) => this.render(delta, alpha, frame));
    this.interval.start()
  }
}

export { Game }