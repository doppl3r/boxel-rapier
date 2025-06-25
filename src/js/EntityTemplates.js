/*
  An EntityTemplate provides predefined properties for the EntityFactory
*/

class EntityTemplates {
  constructor() {

  }

  static cube = {
    body: {
      status: 1 // Fixed
    },
    colliders: [
      {
        friction: 0,
        shapeDesc: ['cuboid', 0.5, 0.5, 0.5]
      }
    ],
    name: 'cube',
    object3d: {
      userData: {
        path: 'glb/cube.glb'
      }
    }
  }

  static light_hemisphere = {
    body: {
      status: 1
    },
    name: 'light',
    object3d: {
      userData: {
        light: ['HemisphereLight', '#ffffff', '#aaaaaa', Math.PI]
      }
    }
  }

  static spike = {
    body: {
      status: 1
    },
    colliders: [
      {
        shapeDesc: ['cuboid', 0.5, 0.5, 0.5]
      },
      {
        events: [
          {
            name: 'teleport',
            value: { x: 0, y: 1, z: 0 }
          }
        ],
        isSensor: true,
        shapeDesc: ['cuboid', 0.375, 0.125, 0.375],
        translation: { x: 0, y: 0.5, z: 0 }
      }
    ],
    object3d: {
      userData: {
        path: 'glb/spike.glb'
      }
    },
    name: 'teleport'
  }

  static teleport = {
    body: {
      status: 1
    },
    colliders: [
      {
        events: [
          {
            name: 'teleport',
            value: { x: 0, y: 0, z: 0 }
          }
        ],
        shapeDesc: ['cuboid', 0.5, 0.5, 0.5]
      }
    ],
    object3d: {
      userData: {
        path: 'glb/player.glb'
      }
    },
    name: 'teleport'
  }

  static player = {
    body: {
      ccd: true,
      enabledTranslations: { x: true, y: true, z: false },
      enabledRotations: { x: false, y: false, z: true },
      softCcdPrediction: 0.5,
      status: 0
    },
    colliders: [
      {
        friction: 0,
        shapeDesc: ['cuboid', 0.375, 0.375, 0.375]
      }
    ],
    name: 'player',
    object3d: {
      scale: { x: 0.75, y: 0.75, z: 0.75 },
      userData: {
        path: 'glb/player.glb'
      }
    }
  }

  static player_sprite = {
    body: {
      ccd: true,
      enabledTranslations: { x: true, y: true, z: false },
      enabledRotations: { x: false, y: false, z: true },
      softCcdPrediction: 0.5,
      status: 0
    },
    colliders: [
      {
        friction: 0,
        shapeDesc: ['cuboid', 0.375, 0.375, 0.375]
      }
    ],
    name: 'player',
    object3d: {
      scale: { x: 0.75, y: 0.75, z: 0.75 },
      userData: {
        path: 'png/character.png',
        mesh: {
          geometry: ['PlaneGeometry', 1, 1, 1, 1],
          material: ['MeshBasicMaterial']
        }
      }
    }
  }

  static player_controller_2d = {
    body: {
      enabledTranslations: { x: true, y: true, z: false },
      status: 2 // 2 = KinematicPositionBased
    },
    colliders: [
      {
        shapeDesc: ['cuboid', 0.375, 0.375, 0.375]
      }
    ],
    controller: {
      offset: 0
    },
    name: 'player',
    object3d: {
      scale: { x: 0.75, y: 0.75, z: 0.75 },
      userData: {
        path: 'glb/player.glb'
      }
    }
  }

  static voxels = {
    body: {
      position: { x: -0.5, y: -0.5, z: -0.5 },
      status: 1
    },
    colliders: [
      {
        shapeDesc: ['voxels', [0, 0, 0], { x: 1, y: 1, z: 1 }]
      }
    ],
    name: 'voxels',
    object3d: {
      scale: { x: 1, y: 1, z: 1 },
      userData: {
        path: 'glb/cube.glb'
      }
    }
  }

  static trimesh = {
    body: {
      status: 1
    },
    colliders: [
      {
        friction: 0.5,
        shapeDesc: ['trimesh'] // Needs vertices and indices
      }
    ],
    name: 'trimesh'
  }

  static empty = {
    body: {
      status: 1 // Fixed
    },
    name: 'empty'
  }

  static plane = {
    body: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      status: 1
    },
    colliders: [
      {
        friction: 0.5,
        shapeDesc: ['trimesh'] // Needs vertices and indices
      }
    ],
    name: 'plane',
    object3d: {
      userData: {
        mesh: {
          geometry: ['PlaneGeometry', 9, 9, 9, 9],
          material: ['MeshBasicMaterial', { color: '#0287ef' }]
        }
      }
    }
  }

  static camera_perspective = {
    name: 'camera',
    object3d: {
      userData: {
        camera: ['PerspectiveCamera', 45, window.innerWidth / window.innerHeight, 0.05, 100]
      }
    }
  }

  static camera_orthographic = {
    name: 'camera',
    object3d: {
      userData: {
        camera: ['OrthographicCamera', -window.innerWidth / window.innerHeight, window.innerWidth / window.innerHeight, 1, -1, 0.05, 100]
      }
    }
  }
}

export { EntityTemplates }