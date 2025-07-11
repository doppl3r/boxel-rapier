# Boxel Rapier

Boxel Rapier uses the Rapier.js physics engine and Three.js 3D library to demonstrate gameplay. This example shows how to create a **Kinematic Character Controller** (aka "KCC").

## Key Classes
 - [Entity.js](src/js/Entity.js) - The base class for all entities.
 - [EntityFactory.js](src/js/EntityFactory.js) - Creates entity components. Ex: 3D mesh, colliders, etc.
 - [EntityControllerDynamic2D.js](src/js/EntityControllerDynamic2D.js) - A 2D input controller class for Dynamic Rigid Bodies.
 - [EntityControllerKinematic2D.js](src/js/EntityControllerKinematic2D.js) - A 2D input controller class for Kinematic Rigid Bodies. Can be used for players, conveyors, doors, etc.
 - [Game.js](src/js/Game.js) - Handles all game states, entities, and resources.

![Screenshot](files/png/boxel-rapier-screenshot.png)

## Features

- **Asset loader**: Dynamically load and cache 3D models, audio, images etc.
- **Entity factory**: Create entities that include rigid bodies, colliders and 3D models using JSON properties
- **Entity templates**: Predefined instructions for creating entities
- **Entity controllers**: Provides user controls for entities
- **Collision event system**: Dispatch collision events between entities
- **Game rendering pipeline**: Renders and smoothly interpolates 3D entity meshes in sync with the world rigid body coordinates

## Other Features

### Interpolation

To improve visual performance, this example separates the `physics` engine and the `graphics` engine into 2 separate [Interval.js](src/js/Interval.js) loops. The `physics` engine loop runs at 60hz, while the `graphics` loop runs at the refresh rate of your monitor (ex: 240hz).

The `alpha` value (between 0.0 and 1.0) is calculated by adding the sum of time that has changed between these two loops. The alpha value is then applied to the 3D objects position/rotation each time the graphics loop is called.

Here is a `slow motion` example that demonstrates the interpolation between the physics engine and the graphical rendering. Without interpolation, the game would appear as choppy as the wireframes.

![Interpolation](files/gif/interpolation.gif)

### Custom Events

The physics entity system is designed to dispatch events to observers by event type (ex: `collision`, `added`, `removed` etc). The following example shows how you can prescribe a `collider` event to a specific entity using object data (see [EntityTemplates.js](src/js/EntityTemplates.js)):
```
static teleport = {
  colliders: [
    {
      events: [
        {
          name: 'teleport',
          value: { x: 0, y: 0, z: 0 }
        }
      ],
      shapeDesc: {
        type: 'cuboid',
        arguments: [0.5, 0.5, 0.5]
      }
    }
  ],
  object3D: {
    children: ['asset:glb/teleport.glb']
  }
}
```

This is where the logic of the "teleport" function exists (see [EntityEvents.js](src/js/EntityEvents.js)):
```
static teleport = event => {
  event.pair.setPosition(event.value);
}
```

## Vite

This example uses [Vite](https://vitejs.dev) for **hosting** a local environment and includes commands to **package** for web (similar to Webpack).

## Vue.js

[Vue.js](https://vuejs.org/) is used for the game UI, and leverages the latest **Composition API** introduced in version 3. This JavaScript framework is *"An approachable, performant and versatile framework for building web user interfaces"*.

**Example Component**

 - [PageHome.vue](src/vue/PageHome.vue) - A simple Vue.js component you can modify.

## Local Development

- Install NodeJS package libraries: `npm install`
- Run development libraries `npm run dev`
- Use the link it provides

## Update NPM libraries

- Run `npm outdated`
- Run `npm i package-name@latest` (for Rapier.js, replace `latest` with `canary`)

## Build for release

- Run `npm run dist` to create zipped files