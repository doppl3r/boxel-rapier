class EntityActions {
  constructor() {

  }

  static teleport = event => {
    setTimeout(() => event.pair.setPosition(event.value), 1000);
  }
}

export { EntityActions }