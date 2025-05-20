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
      model: {
        name: 'cube'
      }
    }
  }

  static player = {
    body: {
      status: 2 // KinematicPositionBased
    },
    colliders: [
      {
        shapeDesc: ['cuboid', 0.375, 0.375, 0.375]
      }
    ],
    name: 'player',
    object3d: {
      model: {
        name: 'player'
      }
    }
  }
}

export { EntityTemplates }