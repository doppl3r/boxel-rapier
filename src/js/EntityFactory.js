import { AnimationMixer, Euler, InstancedMesh, Object3D, Quaternion, Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ActiveCollisionTypes, ActiveEvents, ColliderDesc, RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d';
import { LightFactory } from './LightFactory.js';
import { Entity } from './Entity.js';
import { EntityTemplates } from './EntityTemplates.js';
import { EntityEvents } from './EntityEvents.js';
import { ObjectAssign } from './ObjectAssign.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';

class EntityFactory {
  constructor() {

  }

  static create(options, world) {
    // Combine new options with existing template
    options = ObjectAssign({}, EntityTemplates[options.template], options);

    // Initialize entity
    const entity = new Entity(options);
    const object3D = this.createObject3D(options.object3d, options.colliders);
    const rigidBodyDesc = this.createRigidBodyDesc(options.body);
    const rigidBody = this.createRigidBody(rigidBodyDesc, world);

    // Create colliders from array
    options.colliders?.forEach(colliderOptions => {
      // Create the collider and attach to the rigidBody
      const colliderDesc = this.createColliderDesc(colliderOptions);
      const collider = this.createCollider(colliderDesc, rigidBody, world);
      this.createColliderEvents(colliderOptions.events, collider, entity);
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

  static createColliderEvents(events, collider, entity) {
    // Loop through array of event descriptions
    events?.forEach(event => {
      // Add collision event listener to entity
      entity.addEventListener('collision', e => {
        // Trigger event on initial contact (or if event "started" matches collision "started")
        if (event.started === undefined && e.started === true || event.started === e.started) {
          // Trigger match collider handles
          if (e.handle === collider.handle) {
            EntityEvents[event.name]({ value: event.value, ...e });
          }
        }
      });
    });
  }

  static createObject3D(options, colliderOptions) {
    options = Object.assign({
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    }, options);

    // Create object from options
    const object3D = new Object3D();

    // Set object properties
    options.rotation = options.rotation.w ? _e.setFromQuaternion(_q.copy(options.rotation)) : _e.setFromVector3(_v.copy(options.rotation));
    object3D.position.copy(options.position);
    object3D.rotation.copy(options.rotation);
    object3D.scale.copy(options.scale);

    // Create and add children
    if (options?.userData?.path) {
      // Load asset from singleton assets
      game.assets.load(options.userData.path, asset => {
        // Clone asset before transforming
        const obj = clone(asset);

        // Check shape type
        if (colliderOptions[0].shapeDesc[0] === 'voxels') {
          const instancedMesh = this.createInstancedMesh(colliderOptions, obj);

          // Add instanced mesh
          object3D.add(instancedMesh);
        }
        else {
          // Create animation mixer (optional)
          const mixer = this.createMixer(obj)
          if (mixer) {
            // Assign mixer and add render event listener
            object3D.mixer = mixer;
            object3D.addEventListener('rendered', ({ loop }) => {
              mixer.update(loop.delta / 1000);
            });
          }

          // Add cloned asset to 3D object
          object3D.add(obj);
        }
      });
    }
    else if (options?.userData?.type?.includes('Light')) {
      // Create 3D light
      const light = this.createLight(options);
      object3D.add(light);
    }
    return object3D;
  }

  static createInstancedMesh(options, object3D) {
    // Combine geometries
    let geometries = [];
    let instancedMaterials = [];
    let shape = options[0].shapeDesc;

    // Traverse and merge all geometries
    object3D.traverse(obj => {
      if (obj.isMesh) {
        // Translate geometry from mesh origin
        obj.geometry.rotateX(obj.rotation.x);
        obj.geometry.rotateY(obj.rotation.y);
        obj.geometry.rotateZ(obj.rotation.z);
        obj.geometry.scale(obj.scale.x, obj.scale.y, obj.scale.z);
        obj.geometry.translate(obj.position.x, obj.position.y, obj.position.z);

        // Push geometry to array for merge
        geometries.push(obj.geometry);

        // Assign material
        instancedMaterials.push(obj.material);
      }
    });
    
    // Create instanced mesh
    const instancedGeometry = mergeGeometries(geometries, true);
    const instancedLength = shape[1].length / 3; // x + y + z = 3
    const instancedMesh = new InstancedMesh(instancedGeometry, instancedMaterials, instancedLength);

    // Update matrixes
    const dummy = new Object3D();
    const point = shape[1];
    for (let i = 0; i < instancedLength; i++) {
      dummy.position.set(
        point[(i * 3)] + 0.5,
        point[(i * 3) + 1] + 0.5,
        point[(i * 3) + 2] + 0.5
      );
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
      instancedMesh.instanceMatrix.needsUpdate = true;
    }

    // Return object 3D instanced mesh
    return instancedMesh;
  }

  static createMixer(object3D) {
    // Add mixer if animations exist
    if (object3D.animations.length > 0) {
      const loopType = object3D.userData.loop || 2201; // 2201 = LoopRepeat, 2200 = LoopOnce
      const mixer = new AnimationMixer(object3D);
      mixer.actions = {};
      
      // Add all animations (for nested objects)
      for (let i = 0; i < object3D.animations.length; i++) {
        const animation = object3D.animations[i];
        const action = mixer.clipAction(animation);
        if (loopType == 2200) {
          action.setLoop(loopType);
          action.clampWhenFinished = true;
        }
        action.play(); // Activate action by default
        action.setEffectiveWeight(0); // Clear action influence
        mixer.actions[animation.name] = action;

        // Set active action to first action
        if (i == 0) {
          mixer.actions['active'] = action;
          action.setEffectiveWeight(1);
        }
      }

      // Add action helper function
      mixer.play = function(name, duration = 1) {
        var startAction = mixer.actions['active'];
        var endAction = mixer.actions[name];
        
        // Check if action exists
        if (endAction && endAction != startAction) {
          // Fade in from no animation
          if (startAction == null) {
            endAction.setEffectiveWeight(1);
            endAction.reset().fadeIn(duration);
          }
          else {
            // Cross fade animation with duration
            startAction.setEffectiveWeight(1);
            endAction.setEffectiveWeight(1);
            endAction.reset().crossFadeFrom(startAction, duration);
          }

          // Store action data for cross fade
          endAction['duration'] = duration;
          mixer.actions['active'] = endAction;
        }
      }

      // Return newly created mixer
      return mixer;
    }
  }

  static createLight(options) {
    return LightFactory.create(options.userData.type, options.userData);
  }

  static createController(options, world) {
    if (options) {
      // Set base options
      options = Object.assign({
        applyImpulsesMass: 1,
        applyImpulsesToDynamicBodies: true,
        autostepMaxHeight: 0.125, // 0.5
        autostepMinWidth: 0.5, // 0.2
        autostepIncludeDynamicBodies: true,
        maxSlopeClimbAngle: 45 * Math.PI / 180,
        minSlopeClimbAngle: 30 * Math.PI / 180,
        offset: 0.01,
        slideEnabled: true,
        snapToGroundDistance: 0
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
  }

  static destroy(entity, world) {
    // Remove rigid body (and attached colliders/joints)
    world.removeRigidBody(entity.rigidBody);
  }
}

// Assign local helper components
const _v = new Vector3();
const _e = new Euler();
const _q = new Quaternion();

export { EntityFactory }