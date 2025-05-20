<script setup>
  import { onMounted, ref } from 'vue';

  const canvas = ref(game.scene.graphics.canvas);

  // Initialize app and expose to window scope
  var title = ref('PageHome.vue');

  // Initialize app after canvas has been mounted
  onMounted(() => {
    canvas.value.replaceWith(game.scene.graphics.canvas);
  });
</script>

<template>
  <div>
    <canvas ref="canvas"></canvas>
    <h1>{{ title }}</h1>
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