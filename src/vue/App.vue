<script setup>
  import '../scss/Global.scss';
  import { onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n';

  // Initialize components
  const i18n = useI18n();
  const route = useRoute();

  function onLoad() {
    
  }

  onMounted(function() {
    
  });

  onUnmounted(function() {
    
  });
</script>

<template>
  <!-- Render page component using Routes.js -->
  <div class="page" :class="route.name">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>

</style>