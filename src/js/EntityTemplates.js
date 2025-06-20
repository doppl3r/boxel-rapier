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

  static light = {
    body: {
      status: 1
    },
    name: 'light',
    object3d: {
      userData: {
        type: 'PointLight',
        color: '#ffffff'
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
        path: 'glb/character.glb'
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
      status: 1
    },
    colliders: [
      {
        shapeDesc: ['voxels', 
          [
            -3, 0, 0,
            -2, 0, 0,
            -1, 0, 0,
            0, 0, 0,
            1, 0, 0,
            2, 0, 0,
            3, 0, 0,
          ],
          { x: 1, y: 1, z: 1 }
        ]
      }
    ],
    name: 'voxels',
    object3d: {
      scale: { x: 1, y: 1, z: 1 },
      userData: {
        path: 'glb/spike.glb'
      }
    }
  }
}

export { EntityTemplates }