class EntityTemplates {
  constructor() {

  }

  static cube = {
    body: {
      status: 1 // Fixed
    },
    colliders: [
      {
        shapeDesc: ['cuboid', 0.5, 0.5, 0.5]
      }
    ],
    name: 'cube',
    object3d: {
      userData: {
        path: '../glb/cube.glb'
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
            value: { x: 0, y: 3, z: 0 }
          }
        ],
        isSensor: true,
        shapeDesc: ['cuboid', 0.375, 0.125, 0.375],
        translation: { x: 0, y: 0.5, z: 0 }
      }
    ],
    object3d: {
      userData: {
        path: '../glb/spike.glb'
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
            value: { x: 0, y: 3, z: 0 }
          }
        ],
        shapeDesc: ['cuboid', 0.5, 0.5, 0.5]
      }
    ],
    object3d: {
      userData: {
        path: '../glb/player.glb'
      }
    },
    name: 'teleport'
  }

  static player = {
    body: {
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
        path: '../glb/player.glb'
      }
    }
  }

  static voxels = {
    body: {
      position: { x: 0, y: -2, z: 0 },
      status: 1
    },
    colliders: [
      {
        shapeDesc: ['voxels', 
          [
            0, 0, 0,
            2, 0, 0,
            0, 2, 0,
            2, 2, 0
          ],
        { x: 1, y: 1, z: 1 }]
      }
    ]
  }
}

export { EntityTemplates }