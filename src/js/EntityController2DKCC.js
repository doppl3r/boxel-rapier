import { Vector3 } from 'three';
import { QueryFilterFlags } from '@dimforge/rapier3d';
import JoystickController from "joystick-controller";

/*
  The following controller receives user input that can control
  entity properties (such as position, force, etc.)
*/

class EntityController2DKCC {
  constructor(controller) {
    // Declare components
    this.controller = controller;
    this.entity;

    // Initialize force properties
    this.velocity = new Vector3();
    this.forceDirection = new Vector3();
    this.forceAcceleration = 1;
    this.forceSpeedMax = Infinity;
    this.joystick = new JoystickController({
      maxRange: 50,
      level: 10,
      radius: 50,
      joystickRadius: 25,
      opacity: 1,
      distortion: true,
      x: '50%',
      y: '25%',
      dynamicPosition: true,
      dynamicPositionTarget: document.getElementById('app'),
      hideContextMenu: true
    }, e => this.joystickMove(e));

    // Initialize input properties
    this.keys = {};
    this.jumpBuffer = 0; // ms
    this.inputBuffer = 100; // ms
    this.allowJump = true;

    // Add input event listeners
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('pointerdown', this.onPointerDown);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  setEntity(entity) {
    this.entity = entity;
    this.entity.addEventListener('updated', this.onUpdated);
    this.entity.addEventListener('rendered', this.onRendered);
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

    // Apply constant gravity force (and horizontal damping)
    this.velocity.y -= 0.025;

    // Add movement damping (air resistance)
    this.velocity.x *= 0.9;

    // Check user input and update force
    this.updateControls();
    this.updateForce();

    // Move entity
    this.move(this.velocity);
    
    // Set vertical velocity to zero if grounded
    if (this.controller.computedGrounded()) {
      this.allowJump = true;
      this.velocity.y = 0;
    }
  }

  onRendered = ({ loop }) => {
    // TODO: Decouple game camera
    const camera = game.stage.graphics.camera;
    camera.position.copy(this.entity.object3D.position);
    camera.position.z += 20;
    camera.position.y += 2;
    camera.lookAt(this.entity.object3D.position);
  }

  updateControls() {
    let direction = 0;

    if (this.joystick.started) {
      direction = this.joystick.leveledX * 0.1;
      if (this.joystick.leveledY > 7) this.jump();
    }
    else {
      // Conditionally assign direction from keyboard input
      if (this.keys['KeyA'] == true || this.keys['ArrowLeft'] == true) direction = -1;
      else if (this.keys['KeyD'] == true || this.keys['ArrowRight'] == true) direction = 1;
    }
    
    // Rotate direction vector according to gravity angle
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
    this.forceDirection.copy(direction); // Ex: -1.0 to 1.0
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
      this.controller.computeColliderMovement(this.entity.rigidBody.collider(0), desiredTranslation, QueryFilterFlags['EXCLUDE_SENSORS']);
      _v.copy(this.entity.rigidBody.translation());
      _v.add(this.controller.computedMovement());
      _v.z = 0; // Force z-axis lock
      this.entity.rigidBody.setNextKinematicTranslation(_v);
    }
  }

  onKeyDown = ({ code, repeat }) => {
    // Assign key inputs to true (once)
    if (repeat) return;
    this.keys[code] = true;

    // Add keybindings
    if (this.keys['Space'] == true || this.keys['ArrowUp'] == true) this.jump();
  }

  onKeyUp = ({ code }) => {
    // Set key values to false
    this.keys[code] = false;
  }

  onPointerDown = (e) => {
    
  }

  onPointerUp = (e) => {
    
  }

  joystickMove(e) {
    //console.log(e);
  }

  destroy() {
    this.joystick.destroy();
    this.entity.addEventListener('updated', this.update);
    this.entity.addEventListener('rendered', this.render);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('pointerup', this.onPointerUp);
  }
}

const _v = new Vector3();

export { EntityController2DKCC }