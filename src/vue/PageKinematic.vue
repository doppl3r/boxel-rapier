<script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { Game } from '../js/Game.js';
  import { EntityFactory } from '../js/EntityFactory.js';
  import { EntityControllerKinematic2D } from '../js/EntityControllerKinematic2D.js';

  // Initialize Vue components
  const route = useRoute();
  const canvas = ref();
  let entityController;
  let game;

  // Initialize app after canvas has been mounted
  onMounted(async () => {
    // Create new instances of game components
    game = window.game = new Game();

    // Create controller
    const controller = EntityFactory.createController({}, game.world);
    entityController = new EntityControllerKinematic2D(controller);
    entityController.setCamera(game.graphics.camera);

    // Load batch of assets
    game.assets.loadBatch([
        'png/icon.png',
        'ogg/click.ogg'
      ]
    );
    await game.load('json/level-1.json');
    game.start();

    // Initialize 2D controller
    game.entities.forEach(entity => {
      if (entity.name === 'player') {
        entityController.setEntity(entity);
      }
    });

    // Replace canvas element
    canvas.value.replaceWith(game.graphics.canvas);
  });

  onUnmounted(() => {
    game.stop();
    game.unload();
    game.world.free();
    entityController.destroy();
  });
</script>

<template>
  <div>
    <canvas ref="canvas"></canvas>
    <h1>{{ route.meta.title }}</h1>
  </div>
</template>

<style lang="scss" scoped>
  h1 {
    color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>