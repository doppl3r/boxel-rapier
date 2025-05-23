import { Assets } from './Assets.js';
import { Scene } from './Scene.js';
import { Interval } from './Interval.js';

class Game {
  constructor() {
    this.assets = new Assets();
    this.scene = new Scene();
    this.interval = new Interval();

    // TODO: Remove tests
    this.start();
    this.scene.load('./json/level-1.json');
  }

  update(loop) {
    this.scene.update(loop);
  }
  
  render(loop) {
    this.scene.render(loop);
  }

  start() {
    this.interval.add(loop => this.update(loop), 1000 / 60);
    this.interval.add(loop => this.render(loop));
    this.interval.start();
  }
}

export { Game }