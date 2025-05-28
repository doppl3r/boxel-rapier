import { Vector3 } from 'three';
import { QueryFilterFlags } from '@dimforge/rapier3d';

/*
  The EntityInput receives user input that can control
  entity properties (such as position, force, etc.)
*/

class EntityInput {
  constructor() {
    // Declare components
    this.entity;

    // Initialize force properties
    this.velocity = new Vector3();
    this.forceDirection = new Vector3();
    this.forceAcceleration = 1;
    this.forceSpeedMax = Infinity;

    // Initialize input properties
    this.keys = {};
    this.jumpBuffer = 0; // ms
    this.inputBuffer = 100; // ms
    this.allowJump = true;

    // Add input event listeners
    document.addEventListener('keydown', e => this.keyDown(e));
    document.addEventListener('keyup', e => this.keyUp(e));
    document.addEventListener('pointerdown', e => this.pointerDown(e));
    document.addEventListener('pointerup', e => this.pointerUp(e));
  }

  setEntity(entity) {
    this.entity = entity;
    this.entity.addEventListener('beforeUpdate', e => this.update(e.loop));
    this.entity.addEventListener('rendered', e => this.render(e.loop));
  }

  update(loop) {
    // Calculate input buffer
    if (this.jumpBuffer > 0) {
      this.jumpBuffer -= loop.delta; // ms

      // Automatically jump if buffer is set
      if (this.allowJump === true) {
        this.jumpBuffer = 0;
        this.jump();
      }
    }

    // Apply constant gravity force (and horizontal damping)
    this.velocity.y -= 0.025;

    this.updateControls();
    this.updateForce();

    // Move entity
    this.move(this.velocity);

    // Check collisions for base collider
    const collision = this.entity.controller.computedCollision(0);
    if (collision) {
      this.allowJump = true;
      // Check ceiling collision
      if (collision.normal1.y < -0.5) {
        this.velocity.y = 0;
      }
    }

    // Set vertical velocity to zero if grounded
    if (this.entity.controller.computedGrounded()) {
      this.velocity.y = 0;
    }
  }

  render(loop) {
    // TODO: Decouple game camera
    const camera = game.stage.graphics.camera;
    camera.position.copy(this.entity.object3D.position);
    camera.position.z += 20;
    camera.position.y += 2;
    camera.lookAt(this.entity.object3D.position);
  }

  updateControls() {
    let direction = 0;

    // Conditionally assign direction from keyboard input
    if (this.keys['KeyA'] == true) direction = -1;
    else if (this.keys['KeyD'] == true) direction = 1;
    else if (this.keys['ArrowLeft'] == true) direction = -1;
    else if (this.keys['ArrowRight'] == true) direction = 1;

    // Rotate direction vector according to gravity angle
    direction = 1;
    _v.copy({ x: direction, y: 0, z: 0 });
    this.setForce(_v, 0.025, 0.15);
  }

  updateForce() {
    // Check if force exists
    if (this.forceDirection.length() > 0) {
      _v.copy(this.velocity);
      const speed = _v.dot(this.forceDirection);
      const speedNext = speed + this.forceAcceleration; // Ex: 0.5 to 4.5
      const speedClamped = Math.max(speed, Math.min(speedNext, this.forceSpeedMax));
      const acceleration = speedClamped - speed; // Ex: 0.5 (or 0 at max speed)
      
      // Update velocity using new force
      this.velocity.x += this.forceDirection.x * acceleration;
      this.velocity.y += this.forceDirection.y * acceleration;
      this.velocity.z += this.forceDirection.z * acceleration;
    }
  }

  setForce(direction = { x: 0, y: 0, z: 0 }, acceleration = 1, max = Infinity) {
    this.forceDirection.copy(direction).normalize(); // Ex: -1.0 to 1.0
    this.forceAcceleration = acceleration;
    this.forceSpeedMax = max;
  }

  jump() {
    if (this.allowJump === true) {
      this.allowJump = false;
      this.velocity.y = 0.475;
    }
    else {
      // Add jump buffer (ms)
      this.jumpBuffer = this.inputBuffer;
    }
  }

  move(desiredTranslation) {
    // Set the next kinematic translation
    if (this.entity.rigidBody.collider(0)) {
      this.entity.controller.computeColliderMovement(this.entity.rigidBody.collider(0), desiredTranslation, QueryFilterFlags['EXCLUDE_SENSORS']);
      _v.copy(this.entity.rigidBody.translation());
      _v.add(this.entity.controller.computedMovement());
      this.entity.rigidBody.setNextKinematicTranslation(_v);
    }
  }

  keyDown({ code, repeat }) {
    // Assign key inputs to true (once)
    if (repeat) return;
    this.keys[code] = true;

    // Add keybindings
    if (this.keys['Space'] == true || this.keys['ArrowUp'] == true) this.jump();
  }

  keyUp({ code }) {
    // Set key values to false
    this.keys[code] = false;
  }

  pointerDown(e) {
    this.jump();
  }

  pointerUp(e) {
    
  }
}

const _v = new Vector3();

export { EntityInput }