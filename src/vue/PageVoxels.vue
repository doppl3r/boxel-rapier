<script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { Game } from '../js/Game.js';
  import { EntityController2D } from '../js/EntityController2D.js';

  // Initialize Vue components
  const route = useRoute();
  const canvas = ref();
  const entityController2D = new EntityController2D();

  // Initialize app after canvas has been mounted
  onMounted(async () => {
    // Initialize singleton game
    const game = window.game = new Game();

    // Set controller camera
    entityController2D.setCamera(game.graphics.camera);

    // Load load entities from JSON
    await game.load('json/level-2.json');
    game.start();

    // Initialize 2D controller
    game.entities.forEach(entity => {
      if (entity.name === 'player') {
        entityController2D.setEntity(entity);
      }
    });

    // Replace canvas element
    canvas.value.replaceWith(game.graphics.canvas);
  });

  onUnmounted(() => {
    game.stop();
    game.unload();
    game.world.free();
    entityController2D.destroy();
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