import { Assets } from './Assets.js';
import { Scene } from './Scene.js';
import { Ticker } from './Ticker.js';

class Game {
  constructor() {
    this.assets = new Assets();
    this.scene = new Scene();
    this.ticker = new Ticker();

    // TODO: Remove test
    this.start();
    console.log(this.scene);
  }

  update({ delta, alpha, frame }) {
    //console.log(delta, alpha, frame);
  }
  
  render({ delta, alpha, frame }) {
    console.log(alpha);
  }

  start() {
    this.ticker.add(data => this.update(data), 1000 / 1);
    this.ticker.add(data => this.render(data), 1000 / 4);
    this.ticker.start();
  }
}

export { Game }