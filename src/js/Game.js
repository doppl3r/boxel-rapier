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

  update(delta, alpha) {
    console.log('interval', delta, alpha);
  }
  
  render(delta, alpha) {
    //console.log(delta, alpha);
  }

  start() {
    this.interval.add((delta, alpha) => this.update(delta, alpha), 1000 / 1);
    this.interval.add((delta, alpha) => this.render(delta, alpha));
    this.interval.start();

    let i = 0;
    //setInterval(() => console.log('setInterval', i++), 1000 / 4);
  }
}

export { Game }