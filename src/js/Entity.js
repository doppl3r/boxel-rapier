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
    this.rigidBodySnapshot;
  }

  update(delta) {
    
  }

  render(delta, alpha) {
    
  }

  set3DObject(object3D) {
    this.object3D = object3D;
  }

  lerp3DObject(alpha = 0) {
    this.object3D?.position.lerpVectors(this.rigidBodySnapshot?.positionPrev, this.rigidBodySnapshot?.position, alpha);
    this.object3D?.quaternion.slerpQuaternions(this.rigidBodySnapshot?.rotationPrev, this.rigidBodySnapshot?.rotation, alpha);
  }

  setRigidBody(rigidBody) {
    this.rigidBody = rigidBody;
  }

  getPosition() {
    return this.rigidBody?.translation();
  }

  setPosition(position) {
    this.rigidBody?.setTranslation(position);
  }

  getRotation() {
    const rotation = this.rigidBody?.rotation()
    if (this.rigidBody?.isKinematic()) rotation = this.rigidBody?.nextRotation()
    return rotation;
  }

  setRotation(rotation) {
    this.rigidBody?.setRotation(rotation);
  }
}

export { Entity }