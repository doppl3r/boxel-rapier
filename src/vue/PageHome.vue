<script setup>
  import { onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const canvas = ref(game.stage.graphics.canvas);

  // Initialize app and expose to window scope
  const i18n = useI18n();
  const title = ref(i18n.t('home.title'));

  // Initialize app after canvas has been mounted
  onMounted(() => {
    canvas.value.replaceWith(game.stage.graphics.canvas);
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