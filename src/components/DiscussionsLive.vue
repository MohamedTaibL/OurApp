<template>
  <div class="discussion-maker">
    <router-link :to="{ name: 'create' }">
      <button class="btn btn-primary">Create Discussion</button>
    </router-link>
    <div class="user-icon">
      <img :src="icon.value" alt="User Icon" v-if="icon.value"/>
      <p>@{{ userName }}</p>
    </div>
  </div>
  <div class="discussions-container">
    <div class="discussions-list">
      <DiscussionCard
        v-for="discussion in discussions"
        :key="discussion.id"
        :discussion="discussion"
      />
    </div>
  </div>
</template>
<script setup>
import { db, auth } from "@/Firebase/Config";
import { ref, onMounted } from "vue";
import DiscussionCard from "@/components/DiscussionCard.vue";

// getting the discussions from the db
const discussions = ref([]);
const icon = ref("https://cdn-icons-png.flaticon.com/512/149/149071.png");
const userName = ref("-Guest-"); // default value for the user name
const userData = ref(null); // default value for the user data

const getDiscussions = async () => {
  const querySnapshot = await db.collection("discussions").get();
  discussions.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// get the user icon and name from the db using his uid
const getUserData = async (uid) => {
  const userDoc = await db.collection("users").doc(uid).get();
  if (userDoc.exists) {
    return userDoc.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

onMounted(() => {
  getDiscussions()
    .then(() => {
      console.log(discussions.value); // getting the discussions from the db
    })
    .catch((error) => {
      console.error("Error getting discussions: ", error);
    });
  auth.onAuthStateChanged(async (user) => {
    if (user && !user.isAnonymous) {
      userData.value = await getUserData(user.uid); // getting the user icon from the db using his uid
      userName.value = userData.value.name; // getting the user name from the db using his uid
      icon.value = userData.value.icon; // getting the user icon from the db using his uid
    } else {
      console.log("No user is signed in.");
    }
  });
});
</script>
