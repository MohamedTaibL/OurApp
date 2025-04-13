<template>
  <div class="profile-view">
    <div class="profile-container" v-if="!editProfile">
      <!-- Parameters Icon in the Top-Right -->
      <div class="top-right-settings">
        <button class="settings-btn" @click="ShowOrHideEdits" v-if = "(!user.isAnonymous)&&(useRoute().params.id === userId)">
          <i class="fas fa-cog"></i> <!-- Font Awesome icon -->
        </button>
      </div>
  
      <!-- Profile Section -->
      <div class="profile-content">
        <!-- Left Section: Profile Picture and Details -->
        <div class="profile-left">
          <img :src="imgpicture" class="profile-picture" alt="Profile Picture" />
          <div class="profile-details">
            <p class="profile-email"><strong>Email:</strong> {{ email }}</p>
            <p class="profile-gender"><strong>Gender:</strong> {{ gender }}</p>
            <p class="profile-birthday"><strong>Birthday:</strong> {{ birthday }}</p>
          </div>
        </div>
  
        <!-- Right Section: Name and Username -->
        <div class="profile-right">
          <h2 class="profile-name">{{ Name }}</h2>
          <p class="profile-username">@{{ username }}</p>
        </div>
      </div>
  
      <!-- Navbar -->
      <div class="profile-navbar">
        <button
          class="navbar-item"
          :class="{ active: activeTab === 'posts' }"
          @click="activeTab = 'posts'"
        >
          Posts
        </button>
        <button
          class="navbar-item"
          :class="{ active: activeTab === 'saves' }"
          @click="activeTab = 'saves'"
          v-if ="(!user.isAnonymous)&&(userId === useRoute().params.id)"
        >
            <!-- Only show Saves tab if the user is the profile owner -->
          Saves
        </button>
      </div>
    </div>
    <!-- Add your edit profile modal here if needed -->
     <div v-if="editProfile" >
         <!-- We will have 3 seperate possibilities, u can only select one each, change password, change email, and change general information( name, username, date of birth, possibily gender as well) , and to display each one at a time, we will use a variable that takes values 1 , 2 and 3 to display each one uniquely -->
            <div>
                <button @click="editsection = 1">Change Password</button>
                <div v-if="editsection === 1">
                    <h3>Change Password</h3>
                    <input type="password" placeholder="Current Password" v-model="currentPassword" />
                    <input type="password" placeholder="New Password" v-model="newPassword" />
                    <button @click="changePassword">Submit</button>
                </div>

            </div>
            <div>
                <button @click="editsection = 2">Change Email</button>
                <div v-if="editsection === 2">
                    <h3>Change Email</h3>
                    <input type="email" placeholder="New Email" />
                    <button>Submit</button>
                </div>
            </div>
            <div>
                <button @click="editsection = 3">Change General Information</button>
                <div v-if="editsection === 3">
                    <h3>Change General Information</h3>
                    <input type="text" placeholder="New Name" />
                    <input type="text" placeholder="New Username" />
                    <input type="date" placeholder="New Date of Birth" />
                    <button>Submit</button>
                </div>
            </div>
            



        <button @click="ShowOrHideEdits"> Go back</button>
     </div>

      <div class="profile-content profile-container profile-posts" v-if="!editProfile">
          <!-- Posts Section -->
          <div v-if="activeTab === 'posts'">
            <DiscussionsLive :userId="route.params.id" /> <!-- Pass the userId prop to DiscussionsLive -->
            <!-- Add your posts content here -->
          </div>

          <!-- Saves Section -->
          <div v-else-if="activeTab === 'saves'">
            <h3>We will show saved posts for the if the profile Owner id matches the authentication current user id, allowing the user to also delete the saved posts if they wish </h3>
            <!-- Add your saves content here -->
          </div>
      </div>
    </div>
  </template>


<script setup>
import { db, auth } from '@/Firebase/Config';
import { useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DiscussionsLive from '@/components/DiscussionsLive.vue'; // Import the DiscussionsLive component
import firebase from 'firebase/app';
import 'firebase/auth';


const imgpicture = ref('');
const Name = ref('');
const username = ref('');
const email = ref('');
const birthday = ref('');
const gender = ref('');
const activeTab = ref('posts'); // Tracks the active tab (Posts or Saves)
const editProfile = ref(false); // Controls the visibility of the edit profile modal
const editsection =ref(0)
const currentPassword = ref('');
const newPassword = ref('');

const user = auth.currentUser;
const userId = user.uid;


const loadData = (userId) =>{
db.collection('users')
  .doc(userId)
  .get()
  .then((doc) => {
    if (doc.exists) {
      console.log('Document data:', doc.data());
      imgpicture.value = doc.data().imageURL;
      Name.value = doc.data().name;
      username.value = doc.data().username;
      email.value = doc.data().email;
      birthday.value = doc.data().birthdate;
      gender.value = doc.data().gender;
    } else {
      console.log('No such document!');
    }
  })
  .catch((error) => {
    console.log('Error getting document:', error);
  });
}
const router = useRouter();
const route = useRoute();

const disconnect = () => {
  auth.signOut()
    .then(() => {
      console.log('User signed out successfully.');
      router.push('/sign');
    })
    .catch((error) => {
      console.error('Error signing out: ', error);
    });
};

function ShowOrHideEdits() {
  editProfile.value = !editProfile.value;
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadData(newId);
    } else {
      router.replace({ name: 'user', params: { id: auth.currentUser.uid } });
    }
  },
  { immediate: true } // Also trigger on initial mount
);

//We first need to check if the current password is correct, and then we can change the password using the updatePassword method from firebase auth.
// We will also need to reauthenticate the user before changing the password, using the reauthenticateWithCredential method from firebase auth.
const changePassword = async () =>{
    if (newPassword.value.length < 6) {
        alert('New password should be at least 6 characters long.');
        newPassword.value = ''; // Clear the new password field 
        return;
    }
    const user = auth.currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword.value);

    try {
        await user.reauthenticateWithCredential(credentials);
        await user.updatePassword(newPassword.value);
        console.log('Password updated successfully!');
        // Optionally, you can show a success message to the user
    } catch (error) {
        console.error('Error updating password: ', error);
        // Optionally, you can show an error message to the user
    }
    finally{
        currentPassword.value = ''; // Clear the current password field
        newPassword.value = ''; // Clear the new password field
    }




}



onMounted(() => {
  if (!useRoute().params.id) {
    router.replace({ name: 'user', params: { id: auth.currentUser.uid } });
  }

  editProfile.value = false; // Initialize editProfile to false on mount
  
  loadData(route.params.id || auth.currentUser.uid); // Load data for the user profile
});



</script>

<style scoped>
/* Profile Container */
.profile-container {
  position: relative;
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
}

/* Top-Right Parameters Icon */
.top-right-settings {
  position: absolute;
  top: 20px;
  right: 20px;
}

.settings-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.settings-btn:hover {
  color: #006a71;
}

/* Profile Content */
.profile-content {
  display: flex;
  align-items: flex-start;
  gap: 30px;
}

.profile-posts {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Left Section: Profile Picture and Details */
.profile-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  flex: 1;
}

/* Profile Picture */
.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ccc;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Profile Details (Under Picture) */
.profile-details {
  text-align: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.profile-email,
.profile-gender,
.profile-birthday {
  font-size: 1rem;
  color: #555;
  margin: 5px 0;
}

/* Right Section: Name and Username */
.profile-right {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.profile-name {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.profile-username {
  font-size: 1.2rem;
  color: #777;
  margin: 10px 0 0;
}

/* Navbar */
.profile-navbar {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.navbar-item {
  background: none;
  font-size: 1.2rem;
  color: #555;
  padding: 10px 20px;
  cursor: pointer;
  transition: color 0.3s ease, background-color 0.3s ease;
  border : none;
}

.navbar-item:hover {
  color: #006a71;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.navbar-item.active {
  color: #ffffff;
  background-color: #006a71;
  border-radius: 5px;
}
</style>