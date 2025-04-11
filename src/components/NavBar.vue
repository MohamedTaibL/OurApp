<template>
    <nav v-if="$route.path !== '/sign'">
    <router-link to="/">Home</router-link> |
    <router-link to="/category">Category</router-link>
  </nav>
</template>
<script setup>
// for now 
</script>