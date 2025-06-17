<script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import { Game } from '../js/Game.js';
  import { EntityJoystick2D } from '../js/EntityJoystick2D.js';

  // Initialize Vue components
  const route = useRoute();
  const canvas = ref();
  const i18n = useI18n();
  let entityController2D;
  let game;

  // Initialize app after canvas has been mounted
  onMounted(async () => {
    // Create new instances of game components
    entityController2D = new EntityJoystick2D();
    game = window.game = new Game();

    // Load batch of assets
    game.assets.loadBatch([
        'png/icon.png',
        'ogg/click.ogg'
      ]
    );
    await game.stage.load('json/level-1.json');
    game.start();

    // Initialize 2D controller
    game.stage.entities.forEach(entity => {
      if (entity.name === 'player') {
        entityController2D.setEntity(entity);
      }
    });

    // Replace canvas element
    canvas.value.replaceWith(game.stage.graphics.canvas);
  });

  onUnmounted(() => {
    game.stop();
    game.stage.unload();
    game.stage.world.free();
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