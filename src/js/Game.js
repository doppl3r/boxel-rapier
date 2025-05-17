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
  }

  update({ delta, alpha }) {
    console.log('update', delta, alpha);
  }
  
  render({ delta, alpha }) {
    console.log('render', delta, alpha);
  }

  start() {
    this.interval.add(loop => this.update(loop), 1000 / 1);
    this.interval.add(loop => this.render(loop), 1000 / 4);
    this.interval.start();

    //let i = 0;
    //setInterval(() => console.log('setInterval', ++i), 1000 / 1);
    //setTimeout(() => this.interval.start(), 1000 / 1);
  }
}

export { Game }