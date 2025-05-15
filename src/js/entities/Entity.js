import { EventDispatcher, Euler, MathUtils, Quaternion, Vector3 } from 'three';
import { ActiveCollisionTypes, ActiveEvents, ColliderDesc, RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d';

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
      body: {
        angularDamping: 0,
        ccd: false,
        enabledRotations: { x: true, y: true, z: true },
        enabledTranslations: { x: true, y: true, z: true },
        isEnabled: true,
        linearDamping: 0,
        position: { x: 0, y: 0, z: 0 },
        quaternion: { x: 0, y: 0, z: 0, w: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        sleeping: false,
        softCcdPrediction: 0,
        status: 0 // 0: Dynamic, 1: Fixed, 2: KinematicPositionBased, 3: KinematicVelocityBased
      },
      colliders: [],
      id: MathUtils.generateUUID(),
      model: null,
      name: '',
      type: 'entity'
    }, options);

    // Declare entity properties
    this.id = options.id;
    this.name = options.name;
    this.desc = {
      colliders: [],
      body: null
    }

    // Initialize rigid body description from options
    this.desc.body = new RigidBodyDesc(isNaN(options.rigidBody.status) ? RigidBodyType[options.rigidBody.status] : options.rigidBody.status);
    this.desc.body.enabledRotations(options.rigidBody.enabledRotations.x, options.rigidBody.enabledRotations.y, options.rigidBody.enabledRotations.z);
    this.desc.body.enabledTranslations(options.rigidBody.enabledTranslations.x, options.rigidBody.enabledTranslations.y, options.rigidBody.enabledTranslations.z);
    this.desc.body.setAngularDamping(options.rigidBody.angularDamping);
    this.desc.body.setCcdEnabled(options.rigidBody.ccd);
    this.desc.body.setEnabled(options.rigidBody.isEnabled);
    this.desc.body.setLinearDamping(options.rigidBody.linearDamping);
    this.desc.body.setRotation(_quaternion.setFromEuler(_euler.setFromVector3(_vector.copy(options.rigidBody.rotation))));
    this.desc.body.setSleeping(options.rigidBody.sleeping);
    this.desc.body.setSoftCcdPrediction(options.rigidBody.softCcdPrediction);
    this.desc.body.setTranslation(options.rigidBody.position.x, options.rigidBody.position.y, options.rigidBody.position.z);
    this.desc.body.setUserData({ id: options.rigidBody.id, parentId: options.rigidBody.parentId }); // Store entity IDs for Physics.js

    // Initialize array of collider descriptions
    options.colliders.forEach(colliderOptions => {
      const desc = new ColliderDesc(colliderOptions.shape);
      desc.setActiveCollisionTypes(isNaN(colliderOptions.activeCollisionTypes) ? ActiveCollisionTypes[colliderOptions.activeCollisionTypes] : colliderOptions.activeCollisionTypes);
      desc.setActiveEvents(isNaN(colliderOptions.activeEvents) ? ActiveEvents[colliderOptions.activeEvents] : colliderOptions.activeEvents);
      desc.setCollisionGroups(colliderOptions.collisionGroups);
      desc.setContactForceEventThreshold(colliderOptions.contactForceEventThreshold);
      desc.setMass(colliderOptions.mass); // Must set before density
      desc.setDensity(colliderOptions.density);
      desc.setFriction(colliderOptions.friction);
      desc.setRestitution(colliderOptions.restitution);
      desc.setSensor(colliderOptions.isSensor);
      desc.setSolverGroups(colliderOptions.solverGroups);
      desc.setTranslation(colliderOptions.translation.x, colliderOptions.translation.y, colliderOptions.translation.z);
      this.desc.colliders.push(desc)
    })
  }
}

// Assign local helper components
const _vector = new Vector3();
const _euler = new Euler();
const _quaternion = new Quaternion();

export { Entity }