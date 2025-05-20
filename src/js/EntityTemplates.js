
class EntityTemplates {
  constructor() {

  }

  static cuboid = {
    body: {
      position: { x: 0, y: 0, z: 0 },
      status: 1
    },
    colliders: [
      {
        shapeDesc: ['cuboid', 0.5, 0.5, 0.5]
      }
    ]
  }
}

export { EntityTemplates }