import { Cuboid } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

/*
  A cuboid is a 6-sided shape that provides a 3D object (Three.js) and
  a 3D rigid body shape (Rapier.js)
*/

class Cube extends Entity {
  // Define static properties
  static model = {
    name: ''
  };

  constructor(options) {
    // Set options with default values
    options = Object.assign({
      colliders: [
        {
          shape: new Cuboid(0.5, 0.5, 0.5)
        }
      ],
      model: {
        color: '#ffffff',
      },
      scale: { x: 1, y: 1, z: 1 }
    }, options);

    // Inherit Entity class
    super(options);
    
    // Set default properties
    this.type = 'cube';
  }
}

export { Cube };