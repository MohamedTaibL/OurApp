<template>
  <nav v-if="$route.path !== '/sign'">
    <router-link to="/">Homeeee yarbi tbeddel</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
<!-- Test  changed again-->
<router-view/>
</template>

<script setup>
import { auth } from '@/Firebase/Config'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';

const router = useRouter()

onMounted (() => {auth.onAuthStateChanged((user) => {
  if (!user) {
    router.push('/sign');
    console.log("I'm mounted");
  } else {
    console.log("User is signed in:", user.email);
    console.log("I'm mounted");
  }
})});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
