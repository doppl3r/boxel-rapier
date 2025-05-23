class EntityEvents {
  constructor() {

  }

  static teleport = event => {
    event.pair.setPosition(event.value);
  }
}

export { EntityEvents }