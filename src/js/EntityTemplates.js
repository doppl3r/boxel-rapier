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
      offset: 0.01
    },
    name: 'player',
    object3d: {
      scale: { x: 0.75, y: 0.75, z: 0.75 },
      userData: {
        path: '../glb/player.glb'
      }
    }
  }
}

export { EntityTemplates }