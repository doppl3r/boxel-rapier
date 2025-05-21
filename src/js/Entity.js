import { EventDispatcher, MathUtils, Quaternion, Vector3 } from 'three';

/*
  An entity is an abstract class that contains a single 3D object and a
  single rigid body object. The rigid body can have multiple colliders.
  
  An entity assumes that the rigid body is being updated at a lower
  interval, and leverages the lerp() function to interpolate the
  3D object at a higher interval (smoother results)
*/

class Entity extends EventDispatcher {
  constructor(options) {
    // Inherit Three.js EventDispatcher system
    super();

    // Set base options
    options = Object.assign({
      id: MathUtils.generateUUID(),
      name: '',
      type: 'entity'
    }, options);

    // Declare entity properties
    this.id = options.id;
    this.name = options.name;
    this.type = options.type;
    this.object3D;
    this.rigidBody;
    this.snapshot = {
      positionPrev: new Vector3(),
      rotationPrev: new Quaternion(),
      position: new Vector3(),
      rotation: new Quaternion()
    }
  }

  update(delta) {
    this.takeSnapshot();
  }
  
  render(delta, alpha) {
    this.lerp3DObject(alpha);
  }
  
  set3DObject(object3D) {
    this.object3D = object3D;
  }
  
  takeSnapshot(copy = false) {
    if (this.rigidBody) {
      this.snapshot.positionPrev.copy(copy ? this.getPosition() : this.snapshot.position);
      this.snapshot.rotationPrev.copy(copy ? this.getRotation() : this.snapshot.rotation);
      this.snapshot.position.copy(this.getPosition());
      this.snapshot.rotation.copy(this.getRotation());
    }
  }

  lerp3DObject(alpha = 0) {
    this.object3D?.position.lerpVectors(this.snapshot.positionPrev, this.snapshot.position, alpha);
    this.object3D?.quaternion.slerpQuaternions(this.snapshot.rotationPrev, this.snapshot.rotation, alpha);
  }

  setRigidBody(rigidBody) {
    this.rigidBody = rigidBody;
    this.takeSnapshot(true);
  }

  getPosition() {
    if (this.rigidBody?.isKinematic()) return this.rigidBody?.nextTranslation();
    return this.rigidBody?.translation();
  }

  setPosition(position) {
    if (this.rigidBody?.isKinematic()) this.rigidBody?.setNextKinematicTranslation(position);
    else this.rigidBody?.setTranslation(position);
  }

  getRotation() {
    if (this.rigidBody?.isKinematic()) return this.rigidBody?.nextRotation();
    return this.rigidBody?.rotation();
  }

  setRotation(rotation) {
    if (this.rigidBody?.isKinematic()) this.rigidBody?.setNextKinematicRotation(rotation);
    else this.rigidBody?.setRotation(rotation);
  }
}

export { Entity }