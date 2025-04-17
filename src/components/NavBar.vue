<template>
    <nav v-if="$route.path !== '/sign'">
    <router-link to="/">Home</router-link> |
    <router-link to="/category">Category</router-link> |
    <router-link to="/user">User Profile</router-link> |
    <span @click="auth.signOut()"> Sign out</span>

    
  </nav>
</template>


<script setup>
import { auth } from '@/Firebase/Config'; // Import your Firebase configuration

</script>




<style scoped>
nav {
  padding: 20px;
  background-color: #006A71; /* Keep the existing background color */
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
}

nav a , span {
  font-weight: bold;
  color: #F2EFE7; /* Update text color to match the palette */
  text-decoration: none;
  transition: color 0.3s ease, transform 0.2s ease;
}

nav a:hover ,span:hover {
  color: #42B983; /* Add hover effect */
  transform: scale(1.1); /* Slightly enlarge on hover */
}

nav a.router-link-exact-active , span {
  color: #F2EFE7; /* Keep active link color consistent */
  text-decoration: underline; /* Optional: Add underline for active link */
}

span{
  cursor: pointer;
}


/* Gradient animation */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>