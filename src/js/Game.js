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

  update({ delta }) {
    this.scene.update(delta);
  }
  
  render({ delta, alpha }) {
    this.scene.render(delta, alpha);
  }

  start() {
    this.interval.add(loop => this.update(loop), 1000 / 30);
    this.interval.add(loop => this.render(loop));
    this.interval.start();
  }
}

export { Game }