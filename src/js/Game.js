import { Assets } from './Assets.js';
import { Interval } from './Interval.js';
import { Stage } from './Stage.js';

class Game {
  constructor() {
    this.assets = new Assets();
    this.interval = new Interval();
    this.stage = new Stage();

    // Load stage from JSON
    this.stage.load('json/level-1.json')
    this.start();
  }

  update(loop) {
    this.stage.update(loop);
  }
  
  render(loop) {
    this.stage.render(loop);
  }

  start() {
    this.interval.add(loop => this.update(loop), 1000 / 60);
    this.interval.add(loop => this.render(loop));
    this.interval.start();
  }
}

export { Game }