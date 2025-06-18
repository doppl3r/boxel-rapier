import { Vector3 } from 'three';

/*
  The following controller receives user input that can control
  entity properties (such as position, force, etc.)
*/

class EntityController2D {
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
    this.pointer = {};
    this.jumpBuffer = 0; // ms
    this.inputBuffer = 100; // ms
    this.allowJump = true;

    // Add DOM event listeners
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('pointerdown', this.onPointerDown);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  setEntity = entity => {
    this.entity = entity;

    // Add entity event listeners
    this.entity.addEventListener('collision', this.onCollision);
    this.entity.addEventListener('updated', this.onUpdated);
    this.entity.addEventListener('rendered', this.onRendered);
  }

  updateControls() {
    let direction = 0;

    // Conditionally assign direction from keyboard input
    if (this.keys['KeyA'] == true || this.keys['ArrowLeft'] == true) direction = -1;
    else if (this.keys['KeyD'] == true || this.keys['ArrowRight'] == true) direction = 1;
    
    // Rotate direction vector according to gravity angle
    _v.copy({ x: direction, y: 0, z: 0 });
    this.setForce(_v, 2, 10);
  }

  updateForce() {
    // Check if force exists
    if (this.forceDirection.length() > 0) {
      _v.copy(this.entity.rigidBody.linvel());
      const speed = _v.dot(this.forceDirection);
      const speedNext = speed + this.forceAcceleration; // Ex: 0.5 to 4.5
      const speedClamped = Math.max(speed, Math.min(speedNext, this.forceSpeedMax));
      const acceleration = speedClamped - speed; // Ex: 0.5 (or 0 at max speed)
      
      // Update velocity using new force
      _v.x += this.forceDirection.x * acceleration;
      _v.y += this.forceDirection.y * acceleration;
      _v.z += this.forceDirection.z * acceleration;
      this.entity.rigidBody.setLinvel(_v);
    }
  }

  setForce(direction = { x: 0, y: 0, z: 0 }, acceleration = 1, max = Infinity) {
    this.forceDirection.copy(direction); // Ex: -1.0 to 1.0
    this.forceAcceleration = acceleration;
    this.forceSpeedMax = max;
  }

  jump() {
    if (this.allowJump === true) {
      const magnitude = 25;
      const mass = this.entity.rigidBody.mass();
      const force = _v.clone().set(0, magnitude * mass, 0);
      const gravity = game.stage.world.gravity;
      const angle = Math.atan2(gravity.y, gravity.x) + (Math.PI / 2);
      
      // Update velocity and apply jump
      this.setAngularVelocityAtAngle({ x: 0, y: 0, z: 8 }, angle); // Set angular velocity
      this.applyVelocityAtAxisAngle({ x: 1, y: 0, z: 1 }, { x: 0, y: 0, z: 1 }, angle); // Cancel y-velocity
      this.applyImpulseAtAngle(force, angle); // Jump
      //this.allowJump = false;
    }
    else {
      // Add jump buffer (ms)
      this.jumpBuffer = this.inputBuffer;
    }
  }

  setAngularVelocityAtAngle(force = { x: 1, y: 1, z: 1 }, angle = 0) {
    const velocity = _v.copy(this.entity.rigidBody.linvel());
    let direction = 1;

    // Rotate velocity before computing direction
    velocity.applyAxisAngle({ x: 0, y: 0, z: 1 }, -angle);
    direction *= -Math.sign(Math.round(velocity.x)); // -1, 0, or 1
    force = _v.copy(force); // Convert vector to Vector3
    force.multiplyScalar(direction);

    // Set new angular velocity
    this.entity.rigidBody.setAngvel(force);
  }

  applyVelocityAtAxisAngle(velocity = { x: 1, y: 1, z: 1 }, axis = { x: 0, y: 0, z: 0 }, angle = 0) {
    // Get current linear velocity
    _v.copy(this.entity.rigidBody.linvel());

    // Rotate velocity along axis, apply scale, then revert rotation
    _v.applyAxisAngle(axis, -angle);
    _v.multiply(velocity);
    _v.applyAxisAngle(axis, angle);

    // Set new linear velocity
    this.entity.rigidBody.setLinvel(_v, true);
  }

  applyImpulseAtAngle(force = { x: 0, y: 0, z: 0 }, angle = 0) {
    // Rotate and apply force at an angle
    force = _v.copy(force);
    force.applyAxisAngle({ x: 0, y: 0, z: 1 }, angle);
    this.entity.rigidBody.applyImpulse(force, true);
  }

  onCollision = ({ started }) => {
    if (started === true) {
      this.allowJump = true;
    }
  }

  onUpdated = ({ loop }) => {
    // Calculate input buffer
    if (this.jumpBuffer > 0) {
      this.jumpBuffer -= loop.delta; // ms

      // Automatically jump if buffer is set
      if (this.allowJump === true) {
        this.jumpBuffer = 0;
        this.jump();
      }
    }

    // Check user input and update force
    this.updateControls();
    this.updateForce();
  }

  onRendered = ({ loop }) => {
    // TODO: Decouple game camera
    const camera = game.stage.graphics.camera;
    camera.position.copy(this.entity.object3D.position);
    camera.position.z += 20;
    camera.position.y += 2;
    camera.lookAt(this.entity.object3D.position);
  }

  onKeyDown = ({ code, repeat }) => {
    // Assign key inputs to true (once)
    if (repeat) return;
    this.keys[code] = true;

    // Add key bindings
    if (this.keys['Space'] == true || this.keys['ArrowUp'] == true) this.jump();
  }

  onKeyUp = ({ code }) => {
    // Set key values to false
    this.keys[code] = false;
  }

  onPointerDown = ({ target, which }) => {
    // Cancel input for non-canvas elements
    if (target.nodeName != 'CANVAS') return;
    
    // Add touch bindings
    this.pointer[which] = true;
    if (this.pointer[1] == true) this.jump();
  }

  onPointerUp = ({ which }) => {
    this.pointer[which] = false;
  }

  destroy() {
    // Remove all event listeners
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('pointerup', this.onPointerUp);
    this.entity.removeEventListener('collision', this.onCollision);
    this.entity.removeEventListener('updated', this.onUpdated);
    this.entity.removeEventListener('rendered', this.onRendered);
  }
}

const _v = new Vector3();

export { EntityController2D }