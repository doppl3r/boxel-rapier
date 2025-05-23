import { Euler, Object3D, Quaternion, Vector3 } from 'three';
import { ActiveCollisionTypes, ActiveEvents, ColliderDesc, RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d';
import { LightFactory } from './LightFactory.js';
import { Entity } from './Entity.js';
import { EntityTemplates } from './EntityTemplates.js';
import { EntityEvents } from './EntityEvents.js';
import { ObjectAssign } from './ObjectAssignDeep.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';

class EntityFactory {
  constructor() {

  }

  static create(options, world) {
    // Combine new options with existing template
    options = ObjectAssign({}, EntityTemplates[options.template], options);

    // Initialize entity
    const entity = new Entity(options);
    const object3D = this.createObject3D(options.object3d);
    const rigidBodyDesc = this.createRigidBodyDesc(options.body, entity);
    const rigidBody = this.createRigidBody(rigidBodyDesc, world);

    // Create colliders from array
    options.colliders?.forEach(colliderOptions => {
      // Create the collider and attach to the rigidBody
      const colliderDesc = this.createColliderDesc(colliderOptions);
      this.createCollider(colliderDesc, rigidBody, world);
      this.createColliderEvents(colliderOptions.events, entity);
    });
    
    // Assign components to entity
    entity.set3DObject(object3D);
    entity.setRigidBody(rigidBody);
    return entity;
  }

  static createRigidBodyDesc(options) {
    // Define default options
    options = Object.assign({
      angularDamping: 0,
      ccd: false,
      enabledRotations: { x: true, y: true, z: true },
      enabledTranslations: { x: true, y: true, z: true },
      isEnabled: true,
      linearDamping: 0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      sleeping: false,
      softCcdPrediction: 0,
      status: 0, // 0: Dynamic, 1: Fixed, 2: KinematicPositionBased, 3: KinematicVelocityBased
      userData: {}
    }, options);

    const rigidBodyDesc = new RigidBodyDesc(isNaN(options.status) ? RigidBodyType[options.status] : options.status);
    const rotation = options.w ? _q.copy(options.rotation) : _q.setFromEuler(_e.setFromVector3(_v.copy(options.rotation)));
    rigidBodyDesc.enabledRotations(options.enabledRotations.x, options.enabledRotations.y, options.enabledRotations.z);
    rigidBodyDesc.enabledTranslations(options.enabledTranslations.x, options.enabledTranslations.y, options.enabledTranslations.z);
    rigidBodyDesc.setAngularDamping(options.angularDamping);
    rigidBodyDesc.setCcdEnabled(options.ccd);
    rigidBodyDesc.setEnabled(options.isEnabled);
    rigidBodyDesc.setLinearDamping(options.linearDamping);
    rigidBodyDesc.setRotation(rotation);
    rigidBodyDesc.setSleeping(options.sleeping);
    rigidBodyDesc.setSoftCcdPrediction(options.softCcdPrediction);
    rigidBodyDesc.setTranslation(options.position.x, options.position.y, options.position.z);
    rigidBodyDesc.setUserData(options.userData);
    return rigidBodyDesc;
  }

  static createRigidBody(rigidBodyDesc, world) {
    return world.createRigidBody(rigidBodyDesc);
  }

  static createColliderDesc(options) {
    options = Object.assign({
      activeCollisionTypes: 'ALL', // 1: DYNAMIC_DYNAMIC, 2: DYNAMIC_FIXED, 12: DYNAMIC_KINEMATIC, 15: DEFAULT, 32: FIXED_FIXED, 8704: KINEMATIC_FIXED, 52224: KINEMATIC_KINEMATIC, 60943: ALL
      activeEvents: 'COLLISION_EVENTS', // 0: NONE, 1: COLLISION_EVENTS, 2: CONTACT_FORCE_EVENTS
      collisionGroups: 0xFFFFFFFF,
      contactForceEventThreshold: 0,
      density: 1,
      events: [],
      friction: 0.5,
      isSensor: false,
      mass: 0,
      restitution: 0,
      shapeDesc: [],
      solverGroups: 0xFFFFFFFF,
      translation: { x: 0, y: 0, z: 0 }
    }, options);

    // Create collider description using shape "type" (ex: "cuboid") with parameters (ex: 0.5, 0.5, 0.5)
    const colliderDesc = ColliderDesc[options.shapeDesc[0]](...options.shapeDesc.slice(1));
    colliderDesc.setActiveCollisionTypes(isNaN(options.activeCollisionTypes) ? ActiveCollisionTypes[options.activeCollisionTypes] : options.activeCollisionTypes);
    colliderDesc.setActiveEvents(isNaN(options.activeEvents) ? ActiveEvents[options.activeEvents] : options.activeEvents);
    colliderDesc.setCollisionGroups(options.collisionGroups);
    colliderDesc.setContactForceEventThreshold(options.contactForceEventThreshold);
    colliderDesc.setMass(options.mass); // Must set before density
    colliderDesc.setDensity(options.density);
    colliderDesc.setFriction(options.friction);
    colliderDesc.setRestitution(options.restitution);
    colliderDesc.setSensor(options.isSensor);
    colliderDesc.setSolverGroups(options.solverGroups);
    colliderDesc.setTranslation(options.translation.x, options.translation.y, options.translation.z);
    return colliderDesc;
  }

  static createCollider(colliderDesc, rigidBody, world) {
    return world.createCollider(colliderDesc, rigidBody);
  }

  static createColliderEvents(events, entity) {
    // Loop through array of event descriptions
    events?.forEach(event => {
      // Add collision event listener to entity
      entity.addEventListener('collision', e => {
        // Trigger event on initial contact (or if event "started" matches collision "started")
        if (event.started === undefined && e.started === true || event.started === e.started) {
          EntityEvents[event.name]({ value: event.value, ...e });
        }
      });
    });
  }

  static createObject3D(options) {
    const object3D = new Object3D();
    if (options?.userData?.path) {
      // Load asset from singleton assets
      game.assets.load(options.userData.path, asset => {
        object3D.add(clone(asset));
      });
    }
    else if (options?.userData?.type?.includes('Light')) {
      // Create 3D light
      object3D.add(LightFactory.create(options.userData.type, options.userData))
    }
    return object3D;
  }

  static createController(options, world) {
    options = Object.assign({
      applyImpulsesMass: 1,
      applyImpulsesToDynamicBodies: true,
      autostepMaxHeight: 0.5,
      autostepMinWidth: 0.2,
      autostepIncludeDynamicBodies: true,
      maxSlopeClimbAngle: 45 * Math.PI / 180,
      minSlopeClimbAngle: 30 * Math.PI / 180,
      offset: 0.01,
      slideEnabled: true,
      snapToGroundDistance: 0.5
    }, options);

    // Create character controller from world
    const controller = world.createCharacterController(options.offset); // Spacing

    // Update controller settings
    controller.setSlideEnabled(options.slideEnabled); // Allow sliding down hill
    controller.setMaxSlopeClimbAngle(options.maxSlopeClimbAngle); // Don’t allow climbing slopes larger than 45 degrees.
    controller.setMinSlopeSlideAngle(options.minSlopeClimbAngle); // Automatically slide down on slopes smaller than 30 degrees.
    controller.enableAutostep(options.autostepMaxHeight, options.autostepMinWidth, options.autostepIncludeDynamicBodies); // (maxHeight, minWidth, includeDynamicBodies) Stair behavior
    controller.enableSnapToGround(options.snapToGroundDistance); // (distance) Set ground snap behavior
    controller.setApplyImpulsesToDynamicBodies(options.applyImpulsesToDynamicBodies); // Add push behavior
    controller.setCharacterMass(options.applyImpulsesMass); // (mass) Set character mass
    return controller;
  }

  static destroy(entity, world) {
    // Remove rigid body
    world.removeRigidBody(entity.rigidBody);

    // Remove colliders
    for (let i = entity.rigidBody.numColliders() - 1; i >= 0; i--) {
      const collider = entity.rigidBody.collider(i);
      world.removeCollider(collider);
    }
  }
}

// Assign local helper components
const _v = new Vector3();
const _e = new Euler();
const _q = new Quaternion();

export { EntityFactory }