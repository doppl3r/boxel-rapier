import { World } from '@dimforge/rapier3d';
import { Graphics } from './Graphics.js';


class Scene {
  constructor() {
    this.graphics = new Graphics();
    this.world = new World({ x: 0.0, y: -9.81 * 8, z: 0.0 });
    this.world.numSolverIterations = 4; // Default = 4
    this.entities = new Map();
  }

  update() {

  }

  render() {

  }

  add(entity) {

  }

  remove(entity) {

  }

  load(json) {

  }
}

export { Scene }