<template>
  <nav v-if="$route.path !== '/sign'">
    <div class="nav-left">
      <span class="nav-arrow" @click="goBack">&lt;</span>
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/category" class="nav-link">Category</router-link>

      <div class="nav-search">
        <input 
          v-model="search" 
          @focus="showSelector = true" 
          @blur="handleBlur"
          placeholder="Search users..."
        />
        <div 
          v-if="showSelector" 
          class="user-selector-popup" 
          @mousedown.prevent
        >
          <UserSelector :filter="search" :redirect="true"/>
        </div>
      </div>
    </div>

    <div class="nav-right">
      <router-link to="/admin" class="nav-link" v-if="isAdmin">Admin Center</router-link>
      <router-link to="/user" class="nav-link">User Profile</router-link>
      <span @click="auth.signOut()" style="color: #f5424e">Sign out</span>
      <span class="nav-arrow" @click="goForward">&gt;</span>
    </div>
  </nav>
</template>


<script setup>
import { auth , db} from '@/Firebase/Config';
import UserSelector from './UserSelector.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const goForward = () => {
  router.go(1);
};

const search = ref("");
const showSelector = ref(false);

// Delay hiding to allow interaction inside popup
const handleBlur = () => {
  setTimeout(() => {
    showSelector.value = false;
  }, 100); 
};

let isAdmin = ref(false); // Default value for isAdmin

onMounted(() => {
  // Check if the user is logged in and set isAdmin accordingly
  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection('users').doc(user.uid).get().then((userDoc) => {
        if (userDoc.exists) {
          const userData = userDoc.data();
          isAdmin.value = userData.isAdmin || false; // Set isAdmin based on the user's data
        } else {
          isAdmin.value = false; // Default to false if user document doesn't exist
        }
      });
    } else {
      isAdmin.value = false; // Default to false if no user is logged in
    }
  });
});

</script>


<style scoped>
nav {
  padding: 16px 32px;
  background-color: #006A71;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-link,
.nav-arrow {
  font-weight: 600;
  color: #F2EFE7;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.2s ease;
  font-size: 16px;
}

.nav-arrow {
  font-size: 20px;
  padding: 4px 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
}

.nav-arrow:hover,
.nav-link:hover {
  color: #42B983;
  transform: scale(1.1);
}

.nav-link.router-link-exact-active,
span.nav-link {
  color: #e1a80c;
}

.nav-search {
  position: relative;
}

.user-selector-popup {
  position: absolute;
  top: 45px;
  left: 0;
  background-color: white;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 999;
  width: 300px;
}

input {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-size: 14px;
  background-color: #F2EFE7;
  color: #333;
  min-width: 200px;
}

input:focus {
  border-color: #42B983;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
}


</style>