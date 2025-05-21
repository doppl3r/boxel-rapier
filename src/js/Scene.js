import { EventQueue, World } from '@dimforge/rapier3d';
import { ObjectAssign } from './ObjectAssignDeep.js'
import { Graphics } from './Graphics.js';
import { Debugger } from './Debugger.js'
import { EntityFactory } from './EntityFactory.js'
import { EntityTemplates } from './EntityTemplates.js'

class Scene {
  constructor() {
    this.graphics = new Graphics();
    this.world = new World({ x: 0.0, y: -9.81 * 8, z: 0.0 });
    this.world.numSolverIterations = 4; // Default = 4
    this.debugger = new Debugger(this.world);
    this.graphics.scene.add(this.debugger);
    this.events = new EventQueue(true);
    this.entities = new Map();
  }

  update(delta) {
    // 1: Advance the simulation by one time step
    this.world.step(this.events);

    // 2: Update debugger from world buffer
    this.debugger.update();

    // 3: Update all entities
    this.entities.forEach(function(entity) {
      entity.update(delta);
    });

    // 4: Dispatch collision events to each entity pair
    this.events.drainCollisionEvents(function(handle1, handle2, started) {
      const collider1 = this.world.getCollider(handle1);
      const collider2 = this.world.getCollider(handle2);
      const rigidBody1 = collider1._parent;
      const rigidBody2 = collider2._parent;
      const entity1 = this.entities.get(rigidBody1.userData.id);
      const entity2 = this.entities.get(rigidBody2.userData.id);
      const event1 = { handle: handle1, pair: entity2, started: started, type: 'collision' };
      const event2 = { handle: handle2, pair: entity1, started: started, type: 'collision' };
      entity1.dispatchEvent(event1);
      entity2.dispatchEvent(event2);
    }.bind(this));
  }

  render(delta, alpha) {
    // Update all 3D object rendering properties
    this.entities.forEach(function(entity) {
      entity.render(delta, alpha);
    });

    // Render all graphics
    this.graphics.render();
  }

  async load(url) {
    const json = await (await fetch(url)).json();

    json.children.forEach(child => {
      // Merge options from template
      const options = ObjectAssign(EntityTemplates[child.template], child);
      const entity = EntityFactory.create(options, this.world);
      this.add(entity);
    });

    // TODO: Replace camera logic
    this.graphics.camera.position.z = 10;
  }

  add(entity) {
    this.entities.set(entity.id, entity);
    this.graphics.scene.add(entity.object3D);
  }

  remove(entity) {
    this.entities.delete(entity.id);
    this.graphics.scene.remove(entity.object3D);

    // Dispatch 'removed' event to observers
    entity.dispatchEvent({ type: 'removed' });
    return entity;
  }
}

export { Scene }