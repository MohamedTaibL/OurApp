<template>
  <div class="home-view"> 
    <h1>Hello {{ userName }} :)</h1>
    <DiscussionsLive />
  </div>
</template>

<script setup>
import { auth, db } from "@/Firebase/Config";
import { ref, onMounted } from "vue";
import DiscussionsLive from "@/components/DiscussionsLive.vue";

const userName = ref("");

// getting the user name from the db using the id (the id of the user is the same as the docRef.id in the db)
const getUserName = async (id) => {
  const userDoc = await db.collection("users").doc(id).get();
  if (userDoc.exists) {
    return userDoc.data().name;
  } else {
    console.log("No such document!");
    return null;
  }
};

onMounted(() => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // if the user is a guest we don't want to get his name from the db we just want to display "Guest"
      if (user.isAnonymous) {
        userName.value = "Guest";
      } else {
        // getting the user name from the db using his uid
        userName.value = await getUserName(user.uid); // getting the user name from the db using his uid
      }
    } else {
      console.log("No user is signed in.");
    }
  });
});
</script>

<style scoped>
.home-view {
  background: linear-gradient(135deg, rgb(242, 239, 231), #48A6A7); /* Gradient background */
  animation: gradientAnimation 10s ease infinite;
  
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

}
</style>