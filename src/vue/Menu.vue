<script setup>
  import { computed } from 'vue';
  import routes from '../js/Routes.js'

  // Initialize props with defaults
  
</script>

<template>
  <nav>
    <ul>
      <template v-for="route in routes">
        <li v-if="route.meta">
          <RouterLink :to="route.path">
            {{ route.meta?.title }}
          </RouterLink>
        </li>
      </template>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
  nav {
    left: 0;
    position: fixed;
    top: 0;

    ul {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        a {
          color: #ffffff;
          font-size: 0.75em;
          opacity: 0.25;
          text-decoration: none;
          text-shadow: 0.125em 0.125em 0 #000000;

          &:hover,
          &.router-link-active {
            opacity: 1;
          }
        }
      }
    }
  }
</style>