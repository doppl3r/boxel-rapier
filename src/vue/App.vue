<script setup>
  import '../scss/Global.scss';
  import { useRoute } from 'vue-router';
  import Menu from './Menu.vue';

  // Initialize components
  const route = useRoute();
</script>

<template>
  <!-- Render page component using Routes.js -->
  <div class="page" :class="route.name">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <Menu></Menu>
  </div>

</template>

<style lang="scss" scoped>

</style>