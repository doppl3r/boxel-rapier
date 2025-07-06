/*
  Add custom "entity events" to this file. The EntityFactory
  will execute these functions by "key" when the entity
  collider event is triggered.
*/

class EntityEvents {
  constructor() {

  }

  static teleport = event => {
    event.pair.setPosition(event.value);
  }
}

export { EntityEvents }