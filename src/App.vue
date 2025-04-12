<template>
  <NavBar class="NavBar"/>
  <router-view :class="routerViewClass"/>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
// if the current route is "/sign" take of the margin-top of the router-view

const route = useRoute();

const routerViewClass = computed(() => {
  return route.path === '/sign' ? 'router-view no-padding' : 'router-view';
});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.NavBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure the navbar is above other content */
}

.router-view {
  padding-top: 100px; /* Adjust this value based on your navbar height */
  height: 100%;
}

.no-padding {
  padding-top: 0; /* No margin for the sign-in page */
}
</style>
