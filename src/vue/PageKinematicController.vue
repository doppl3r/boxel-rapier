<script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import { Game } from '../js/Game.js';
  import { EntityFactory } from '../js/EntityFactory.js';
  import { EntityControllerKinematic2D } from '../js/EntityControllerKinematic2D.js';
  import ProgressBar from './ProgressBar.vue';

  // Initialize Vue components
  const canvas = ref();
  const rendererCSS = ref();
  const progress = ref({ url: '', itemsLoaded: 0, itemsTotal: 0 });
  let entityController;
  let game;

  const loadLevel = async e => {
    // Start game
    game.start();
  }

  // Initialize app after canvas has been mounted
  onMounted(async () => {
    // Create new instances of game components
    game = window.game = new Game();
    game.world.gravity.y = -9.81 * 8; // 8x heavier than normal

    // Create controller
    const optionsController = {
      autostepMaxHeight: 0.125,
      autostepMinWidth: 0.5
    };
    const controller = EntityFactory.createController(optionsController, game.world);
    entityController = new EntityControllerKinematic2D(controller);
    entityController.setCamera(game.graphics.camera);

    // Load game entities
    await game.load('json/test-1.json');
    game.debugger.enable();

    // Initialize 2D controller
    game.entities.forEach(entity => {
      if (entity.name === 'player') {
        entityController.setEntity(entity);
      }
    });

    // Load level after assets are loaded
    game.assets.addEventListener('onStart', e => progress.value = e);
    game.assets.addEventListener('onProgress', e => progress.value = e);
    game.assets.addEventListener('onLoad', loadLevel);

    // Replace canvas element
    canvas.value.replaceWith(game.graphics.canvas);
    rendererCSS.value.replaceWith(game.graphics.rendererCSS.domElement)
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
    <div ref="rendererCSS"></div>
    <ProgressBar :progress="progress" />
  </div>
</template>

<style lang="scss" scoped>
  :deep(.CSS2DRenderer) {
    .CSS2DObject {
      color: #ffffff;
      font-size: 0.75em;
      text-shadow: 0.125em 0.125em 0 #000000;
    }
  }
</style>