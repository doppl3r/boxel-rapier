import { EventQueue, World } from '@dimforge/rapier3d';
import { Graphics } from './Graphics.js';
import { Debugger } from './Debugger.js';
import { EntityFactory } from './EntityFactory.js';
import { EntityInput } from './EntityInput.js';

class Stage {
  constructor() {
    this.graphics = new Graphics();
    this.world = new World({ x: 0.0, y: -9.81 * 8, z: 0.0 });
    this.world.numSolverIterations = 4; // Default = 4
    this.debugger = new Debugger(this.world);
    this.graphics.scene.add(this.debugger);
    this.eventQueue = new EventQueue(true);
    this.entityInput = new EntityInput();
    this.entities = new Map();
  }

  update(loop) {
    // 1: Advance the simulation by one time step
    this.world.step(this.eventQueue);

    // 2: Update debugger from world buffer
    this.debugger.update();

    // 3: Update all entities
    this.entities.forEach(function(entity) {
      entity.update(loop);
    });

    // 4: Dispatch collision events to each entity pair
    this.eventQueue.drainCollisionEvents(function(handle1, handle2, started) {
      const collider1 = this.world.getCollider(handle1);
      const collider2 = this.world.getCollider(handle2);
      const entity1 = this.entities.get(collider1._parent.handle);
      const entity2 = this.entities.get(collider2._parent.handle);
      const event1 = { handle: handle1, pair: entity2, started: started, type: 'collision' };
      const event2 = { handle: handle2, pair: entity1, started: started, type: 'collision' };
      entity1.dispatchEvent(event1);
      entity2.dispatchEvent(event2);
    }.bind(this));
  }

  render(loop) {
    // Update all 3D object rendering properties
    this.entities.forEach(function(entity) {
      entity.render(loop);
    });

    // Render all graphics
    this.graphics.render();
  }

  async load(data) {
    let json = {
      children: []
    };

    // Populate json from scene object
    if (typeof data === 'object') {
      // Loop through data
      data.children.forEach(child => {
        json.children.push({
          body: {
            position: child.position,
            status: child.userData.status ?? 1
          },
          template: child.userData.name.split('.')[0]
        });
        
      });

      // Add global light
      json.children.push({
        body: {
          position: { x: 0, y: 0, z: 4 }
        },
        template: 'light',
        object3d: {
          userData: {
            type: 'HemisphereLight',
            skyColor: '#ffffff',
            groundColor: '#aaaaaa'
          }
        }
      });
    }
    else {
      // Load stage from JSON file
      json = await (await fetch(data)).json();
    }

    // Create entities from children
    json.children.forEach(child => {
      const entity = EntityFactory.create(child, this.world);
      this.add(entity);

      // Assign controller to player type
      if (child.template === 'player') {
        this.entityInput.setEntity(entity);
      }
    });
  }

  add(entity) {
    // Set entity key with unique rigidBody handle
    this.entities.set(entity.rigidBody.handle, entity);
    this.graphics.scene.add(entity.object3D);
    
    // Dispatch 'added' event to observers
    entity.dispatchEvent({ type: 'added' });
    return entity;
  }

  remove(entity) {
    this.entities.delete(entity.id);
    this.graphics.scene.remove(entity.object3D);
    EntityFactory.destroy(entity, this.world);

    // Dispatch 'removed' event to observers
    entity.dispatchEvent({ type: 'removed' });
    return entity;
  }
}

export { Stage }